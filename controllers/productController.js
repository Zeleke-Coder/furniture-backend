import Product from "../models/Product.js";
import { uploadToCloudinary } from "../middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      material,
      color,
      category,
      featured,
      bestseller,
      newArrival,
    } = req.body;

    // 1. UPLOAD ALL IMAGES TO CLOUDINARY
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(
          file.buffer,
          "products",
          "furniture",
          file.originalname,
        ),
      ),
    );

    // 2. SAVE PRODUCT
    const product = await Product.create({
      name,
      description,
      price,
      material,
      color,
      category,
      images: uploadedImages,
      featured,
      bestseller,
      newArrival,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get a single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name",
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 1. DELETE IMAGES FROM CLOUDINARY
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (img) => {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }),
      );
    }

    // 2. DELETE PRODUCT FROM DB
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product and images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      description,
      price,
      material,
      color,
      category,
      featured,
      bestseller,
      newArrival,
      replaceImages, // 👈 NEW FLAG
    } = req.body;

    // 1. UPDATE BASIC FIELDS
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.material = material || product.material;
    product.color = color || product.color;
    product.category = category || product.category;
    product.featured = featured ?? product.featured;
    product.bestseller = bestseller ?? product.bestseller;
    product.newArrival = newArrival ?? product.newArrival;

    // 2. IMAGE REPLACEMENT LOGIC
    if (req.files && req.files.length > 0 && replaceImages === "true") {
      // A. DELETE OLD IMAGES FROM CLOUDINARY
      if (product.images && product.images.length > 0) {
        await Promise.all(
          product.images.map((img) =>
            cloudinary.uploader.destroy(img.public_id),
          ),
        );
      }

      // B. UPLOAD NEW IMAGES
      const uploadedImages = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(
            file.buffer,
            "products",
            "furniture",
            file.originalname,
          ),
        ),
      );

      product.images = uploadedImages;
    }

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
