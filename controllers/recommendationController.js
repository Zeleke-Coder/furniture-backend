import Product from "../models/Product.js";
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const related = await Product.find({
      _id: { $ne: id },
      category: currentProduct.category,
    }).limit(8);

    res.json(related);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching related products",
      error: error.message,
    });
  }
};

export const getSimilarPriceProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const minPrice = currentProduct.price * 0.7;
    const maxPrice = currentProduct.price * 1.3;

    const similarPrice = await Product.find({
      _id: { $ne: id },
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    }).limit(8);

    res.json(similarPrice);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching similar price products",
      error: error.message,
    });
  }
};

export const getSmartRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    const current = await Product.findById(id);

    if (!current) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const allProducts = await Product.find({
      _id: { $ne: id },
    });

    const scoredProducts = allProducts.map((product) => {
      let score = 0;

      // CATEGORY MATCH
      if (product.category === current.category) {
        score += 50;
      }

      // MATERIAL MATCH
      if (product.material === current.material) {
        score += 25;
      }

      // COLOR MATCH
      if (product.color === current.color) {
        score += 15;
      }

      // PRICE SIMILARITY
      const priceDiff = Math.abs(product.price - current.price);

      if (priceDiff <= current.price * 0.3) {
        score += 10;
      }

      return {
        product,
        score,
      };
    });

    const sorted = scoredProducts
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .slice(0, 8);

    res.json(sorted);
  } catch (error) {
    res.status(500).json({
      message: "Error generating smart recommendations",
      error: error.message,
    });
  }
};
