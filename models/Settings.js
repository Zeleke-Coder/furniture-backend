import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  heroTitle: String,

  heroSubtitle: String,

  heroImage: String,

  phone: String,

  whatsapp: String,

  email: String,

  address: String,

  mapUrl: String,
});

export default mongoose.model("Settings", settingsSchema);
