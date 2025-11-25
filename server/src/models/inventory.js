import db from "../db.js";

export const getInventoryByProductId = async (productId) => {
  return await db("inventory").where({ product_id: productId }).first();
};

export const createInventoryForProduct = async (
  productId,
  initialStock = 0
) => {
  const [inv] = await db("inventory")
    .insert({ product_id: productId, stock: initialStock })
    .returning("*");
  return inv;
};


export const decrementStockTransactional = async (productId, quantity, trx) => {

  const inv = await trx("inventory")
    .where({ product_id: productId })
    .forUpdate()
    .first();
  if (!inv) throw new Error("inventory_not_found");
  if (inv.stock < quantity) throw new Error("insufficient_stock");
  const updated = await trx("inventory")
    .where({ product_id: productId })
    .update({
      stock: inv.stock - quantity,
      version: inv.version + 1,
      updated_at: trx.fn.now(),
    })
    .returning("*");
  return updated[0];
};

