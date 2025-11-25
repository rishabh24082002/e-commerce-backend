import express from "express";
import { requireAuth, requireRole } from "../middlewares/requireAuth.js";
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
} from "../controllers/products.js";

const router = express.Router();

router.post("/", requireAuth, requireRole(["admin", "seller"]), createProductController);

router.get("/", getProductsController);

router.get("/:id", getProductByIdController);

router.put("/:id", requireAuth, requireRole(["admin", "seller"]), updateProductController);

export default router;
