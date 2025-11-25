import {
  createProduct,
  findProductById,
  findProducts,
  updateProduct,
} from "../models/product.js";
import {
  getInventoryByProductId,
  createInventoryForProduct,
} from "../models/inventory.js";
import { cacheGet, cacheSet, cacheDel } from "../services/cacheService.js";

export const createProductController = async (req, res) => {
  try {
    const { sku, name, description, price, metadata, initialStock } = req.body;
    if (!sku || !name || price == null) {
      return res.status(400).json({ error: "sku, name, price required" });
    }

    const product = await createProduct({
      sku,
      name,
      description,
      price: Number(price),
      metadata,
    });

    await createInventoryForProduct(product.id, Number(initialStock) || 0);

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "server_error" });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const { q, limit, offset, minPrice, maxPrice, inStock } = req.query;
    const products = await findProducts({
      search: q,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0,
      minPrice,
      maxPrice,
      inStock,
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const cacheKey = `product:${req.params.id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const product = await findProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "not_found" });

    const inventory = await getInventoryByProductId(product.id);
    const payload = { product, inventory };

    await cacheSet(cacheKey, payload, 60); 
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const updates = req.body;
    const product = await updateProduct(req.params.id, updates);
    await cacheDel(`product:${req.params.id}`);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "server_error" });
  }
};
