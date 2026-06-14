import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  customerName: String,

  message: String,

  rating: Number,
});

export default mongoose.model("Testimonial", testimonialSchema);
