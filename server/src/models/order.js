import db from "../db.js";

export const createOrder = async (order, trx) => {
  const executor = trx || db;
  const [o] = await executor("orders")
    .insert({
      user_id: order.user_id || null,
      total: order.total,
      status: order.status || "pending",
      meta: order.meta || null,
    })
    .returning("*");
  return o;
};

export const createOrderItems = async (items, trx) => {
  const executor = trx || db;
  const rows = items.map((i) => ({ ...i }));
  await executor("order_items").insert(rows);
};

export const getOrderById = async (id) => {
  const order = await db("orders").where({ id }).first();
  if (!order) return null;
  const items = await db("order_items").where({ order_id: id });
  return { ...order, items };
};
