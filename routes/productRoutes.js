import express from "express";
const router = express.Router();

import { uploadMultiple } from "../middlewares/upload.js";

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controllers/productController.js";

router.post("/", uploadMultiple("images", 3), createProduct);

router.get("/", getProducts);

router.put("/:id", uploadMultiple("images", 3), updateProduct);

router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

export default router;
