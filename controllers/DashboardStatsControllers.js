import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";

export const getDashboardStatsController = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalCategories = await Category.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "delivered",
    });

    res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
