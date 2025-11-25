import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { createOrder, getOrder } from "../controllers/order.js"
const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/:id", requireAuth, getOrder);

export default router;
