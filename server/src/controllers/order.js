import {
  createOrderTransactional,
  publishOrderEvent,
} from "../services/orderService.js";
import { getOrderById } from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items required" });
    }

    const order = await createOrderTransactional(user.id, items);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    if (err.message === "insufficient_stock") {
      return res.status(409).json({ error: "insufficient_stock" });
    }
    res.status(500).json({ error: "server_error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "not_found" });

    // allow access if owner or admin
    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({ error: "forbidden" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
};
