import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
];

const ALLOWED_TYPES = [...IMAGE_MIME_TYPES, ...AUDIO_MIME_TYPES];

const sanitizeFileName = (name = "chat-file") =>
  name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "")
    .toLowerCase();

const buildPublicId = (originalName) => {
  const safeName = sanitizeFileName(originalName);
  const baseName = safeName.includes(".")
    ? safeName.substring(0, safeName.lastIndexOf("."))
    : safeName;

  return `${Date.now()}-${baseName || "chat-file"}`;
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = IMAGE_MIME_TYPES.includes(file.mimetype);
    const isAudio = AUDIO_MIME_TYPES.includes(file.mimetype);

    if (!isImage && !isAudio) {
      throw new Error("Unsupported file type");
    }

    return {
      folder: isImage ? "velora/chat/images" : "velora/chat/audio",
      resource_type: isImage ? "image" : "video",
      allowed_formats: isImage
        ? ["jpg", "jpeg", "png", "webp"]
        : ["mp3", "mp4", "m4a", "aac", "wav", "ogg", "webm"],
      public_id: buildPublicId(file.originalname),
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, MP3, M4A, AAC, WAV, OGG, and WEBM files are allowed"
      ),
      false
    );
  }
};

const chatUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 5,
  },
});

export default chatUpload;