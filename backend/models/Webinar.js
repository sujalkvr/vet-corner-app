
const mongoose = require("mongoose");

const webinarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    speakerName: {
      type: String,
      required: true,
      trim: true,
    },
    speakerTitle: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    timeZone: {
      type: String,
      default: "Asia/Kolkata",
    },
    posterUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
    },
    registrationLink: {
      type: String,
      trim: true,
      default: "",
    },

    // Webinar fee configuration
    feeType: {
      type: String,
      enum: ["Free", "Paid"],
      default: "Free",
      required: true,
    },
    feeLabel: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
    feeAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Webinar", webinarSchema);
