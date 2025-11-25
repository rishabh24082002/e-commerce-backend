import express from "express";
import { requireAuth, requireRole } from "../middlewares/requireAuth.js";
import {
  getSalesController,
  getTopProductsController,
} from "../controllers/analytics.js";

const router = express.Router();

router.get("/sales", requireAuth, requireRole("admin"), getSalesController);
router.get("/top-products", requireAuth, requireRole("admin"), getTopProductsController);

export default router;
