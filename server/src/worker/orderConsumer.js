import amqp from "amqplib";
import db from "../db.js";

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const ORDER_QUEUE = "order_events";

export async function startOrderWorker() {
  const conn = await amqp.connect(RABBIT_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(ORDER_QUEUE, { durable: true });
  ch.prefetch(1);
  console.log("Order worker started, waiting for messages...");
  ch.consume(ORDER_QUEUE, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      console.log("Received order event", payload);
      if (payload.type === "order.created") {
        const total = Number(payload.total) || 0;
        const date = new Date().toISOString().slice(0, 10);
        await db("sales_daily")
          .insert({ date, total_revenue: total, total_orders: 1 })
          .onConflict("date")
          .merge({
            total_revenue: db.raw("sales_daily.total_revenue + ?", [total]),
            total_orders: db.raw("sales_daily.total_orders + 1"),
            updated_at: db.fn.now(),
          });
      }
      ch.ack(msg);
    } catch (err) {
      console.error("Failed to process message", err);
      ch.nack(msg, false, false); 
    }
  });
}

startOrderWorker()
