import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,

    description: String,

    price: Number,

    material: String,
    color: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    images: [
      {
        url: String,
        public_id: String,
        secure_url: String,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
