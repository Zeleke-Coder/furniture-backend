import express from "express";
const router = express.Router();

import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

router.post("/", createOrder);

router.get("/", getOrders);

router.put("/:id", updateOrderStatus);

export default router;
