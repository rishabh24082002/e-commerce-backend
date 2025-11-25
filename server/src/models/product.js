import db from "../db.js";

export const createProduct = async (prod) => {
  const [product] = await db("products")
    .insert({
      sku: prod.sku,
      name: prod.name,
      description: prod.description || null,
      price: prod.price,
      metadata: prod.metadata || null,
    })
    .returning("*");
  return product;
};

export const updateProduct = async (id, attrs) => {
  const [product] = await db("products")
    .where({ id })
    .update({ ...attrs, updated_at: db.fn.now() })
    .returning("*");
  return product;
};

export const findProductById = async (id) => {
  return await db("products").where({ id }).first();
};

export const findProducts = async ({
  search,
  limit = 5,
  offset = 0,
  minPrice,
  maxPrice,
  inStock,
}) => {
  const q = db("products").select("products.*");

  if (search) {
    q.where((builder) => {
      builder
        .where("products.name", "ILIKE", `%${search}%`)
        .orWhere("products.description", "ILIKE", `%${search}%`)
        .orWhere("products.category", "ILIKE", `%${search}%`);
    });
  }

  if (minPrice) q.where("price", ">=", minPrice);
  if (maxPrice) q.where("price", "<=", maxPrice);

  if (inStock) {
    q.join("inventory", "inventory.product_id", "products.id")
      .where("inventory.stock", ">", 0);
  }

  q.limit(limit).offset(offset);

  return await q;
};

