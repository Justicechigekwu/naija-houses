// import mongoose from "mongoose";

// const reviewReplySchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "userModel",
//       required: true,
//     },
//     text: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 500,
//     },
//   },
//   { timestamps: true, _id: true }
// );

// const reviewSchema = new mongoose.Schema(
//   {
//     listing: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Listing",
//       required: true,
//       index: true,
//     },

//     seller: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "userModel",
//       required: true,
//       index: true,
//     },

//     reviewer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "userModel",
//       required: true,
//       index: true,
//     },

//     chat: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Chat",
//       required: true,
//       index: true,
//     },

//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//       required: true,
//     },

//     comment: {
//       type: String,
//       default: "",
//       trim: true,
//       maxlength: 1000,
//     },

//     helpfulVotes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "userModel",
//       },
//     ],

//     replies: {
//       type: [reviewReplySchema],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// reviewSchema.index({ listing: 1, reviewer: 1 }, { unique: true });
// reviewSchema.index({ seller: 1, createdAt: -1 });

// const Review =
//   mongoose.models.Review || mongoose.model("Review", reviewSchema);

// export default Review;




import mongoose from "mongoose";

const reviewCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true, _id: true }
);

const sellerReplySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true, _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
      index: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
      index: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    ],

    sellerReply: {
      type: sellerReplySchema,
      default: null,
    },

    comments: {
      type: [reviewCommentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ listing: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ seller: 1, createdAt: -1 });

const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;