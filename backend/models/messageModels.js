import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "audio"],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      default: "",
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
      index: true,
    },

    text: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    messageType: {
      type: String,
      enum: ["text", "image", "audio", "mixed"],
      required: true,
      default: "text",
      index: true,
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length <= 5;
        },
        message: "A message cannot have more than 5 attachments",
      },
    },

    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    ],

    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    ],
  },
  { timestamps: true }
);

messageSchema.pre("validate", function (next) {
  const hasText = Boolean(this.text && this.text.trim());
  const attachments = Array.isArray(this.attachments) ? this.attachments : [];
  const hasAttachments = attachments.length > 0;

  if (!hasText && !hasAttachments) {
    return next(new Error("Message must contain text or an attachment"));
  }

  const audioCount = attachments.filter((item) => item.type === "audio").length;

  if (audioCount > 1) {
    return next(new Error("Only one audio attachment is allowed per message"));
  }

  if (audioCount > 0 && attachments.length > 1) {
    return next(
      new Error("Audio messages cannot be combined with multiple attachments")
    );
  }

  if (hasText && hasAttachments) {
    this.messageType = "mixed";
  } else if (hasAttachments) {
    this.messageType = attachments[0].type === "audio" ? "audio" : "image";
  } else {
    this.messageType = "text";
  }

  next();
});

messageSchema.index({ chat: 1, createdAt: 1 });

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;