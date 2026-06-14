import multer from "multer";
import cloudinary from "../config/cloudinary.js";

///////////////////////////////////////////////////////
// MULTER MEMORY STORAGE
///////////////////////////////////////////////////////

const storage = multer.memoryStorage();

///////////////////////////////////////////////////////
// FILE FILTER
///////////////////////////////////////////////////////

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG and WEBP images are allowed"), false);
  }

  cb(null, true);
};

const multerUpload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const uploadToCloudinary = async (
  fileBuffer,
  folderName,
  tenant = "furniture",
  originalName = "image",
) => {
  return new Promise((resolve, reject) => {
    const publicId = `${Date.now()}-${originalName
      .split(".")[0]
      .replace(/\s/g, "-")}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `mesobFurniture/${tenant}/${folderName}`,
        resource_type: "image",
        format: "webp",
        public_id: publicId,
        transformation: [
          {
            width: 1600,
            crop: "limit",
            quality: "auto:best",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.end(fileBuffer);
  });
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const uploadSingle = (fieldName) => multerUpload.single(fieldName);

export const uploadMultiple = (fieldName, maxCount) =>
  multerUpload.array(fieldName, maxCount);
