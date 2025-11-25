import db from "../db.js";

export const getSalesController = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = db("sales_daily")
      .select("date", "total_revenue", "total_orders")
      .orderBy("date", "asc");

    if (from) query.where("date", ">=", from);
    if (to) query.where("date", "<=", to);

    const rows = await query;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
};

export const getTopProductsController = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const rows = await db("order_items")
      .select("product_id")
      .sum({ units_sold: "quantity" })
      .sum({ revenue: db.raw("quantity * unit_price") })
      .groupBy("product_id")
      .orderBy("units_sold", "desc")
      .limit(limit);

    const productIds = rows.map((r) => r.product_id);
    const products = await db("products")
      .whereIn("id", productIds)
      .select("id", "name", "sku");

    const mapped = rows.map((r) => ({
      ...r,
      product: products.find((p) => p.id === r.product_id) || null,
    }));

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
};
