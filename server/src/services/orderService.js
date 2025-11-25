import db from "../db.js";
import { decrementStockTransactional } from "../models/inventory.js";
import { createOrder, createOrderItems } from "../models/order.js"
import amqp from "amqplib";

// RabbitMQ helper - simple publisher
const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const ORDER_QUEUE = "order_events";

export const publishOrderEvent = async (payload) => {
  try {
    const conn = await amqp.connect(RABBIT_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue(ORDER_QUEUE, { durable: true });
    ch.sendToQueue(ORDER_QUEUE, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
    await ch.close();
    await conn.close();
  } catch (err) {
    console.error("Failed to publish order event", err);
    // fallback: log or save into a table for retry
  }
}

export const createOrderTransactional = async (userId, items) => {
  return await db.transaction(async (trx) => {
    // Calculate total
    const total = items.reduce(
      (s, it) => s + Number(it.unitPrice) * it.quantity,
      0
    );

    // For each item, lock inventory and decrement
    for (const it of items) {
      await decrementStockTransactional(it.product_id, it.quantity, trx);
    }

    // Create order and order items
    const order = await createOrder({ user_id: userId, total }, trx);
    const orderItemsPayload = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: i.unitPrice,
    }));
    await createOrderItems(orderItemsPayload, trx);

    // commit transaction by returning
    // publish event asynchronously (outside trx)
    setImmediate(() =>
      publishOrderEvent({
        type: "order.created",
        order_id: order.id,
        user_id: userId,
        total,
        items,
      })
    );

    return order;
  });
};
