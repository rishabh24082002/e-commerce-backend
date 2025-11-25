import db from "../db";
import { decrementStockTransactional } from "../models/inventory";

// Example function to process an order's items within a DB transaction
export const reserveStockForOrder = async (items) => {
  return await db.transaction(async (trx) => {
    // pessimistic locking approach
    for (const it of items) {
      await decrementStockTransactional(it.productId, it.quantity, trx);
    }
    // Optionally create a reservation record or adjust reserved counts
    return true;
  });
};
