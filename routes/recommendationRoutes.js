import express from "express";
const router = express.Router();

import {
  getRelatedProducts,
  getSimilarPriceProducts,
  getSmartRecommendations,
} from "../controllers/recommendationController.js";

// RELATED
router.get("/related/:id", getRelatedProducts);

// PRICE BASED
router.get("/price/:id", getSimilarPriceProducts);

// SMART
router.get("/smart/:id", getSmartRecommendations);

export default router;
