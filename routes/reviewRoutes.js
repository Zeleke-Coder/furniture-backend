import express from "express";
import Review from "../models/Review.js";

export const router = express.Router();
router.get("/:id", async (req, res) => {
  const reviews = await Review.find({
    productId: req.params.id,
  });

  res.json(reviews);
});

router.post("/:id", async (req, res) => {
  const review = new Review({
    productId: req.params.id,
    text: req.body.text,
  });

  await review.save();

  res.json(review);
});

export default router;
