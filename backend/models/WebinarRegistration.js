
const mongoose = require("mongoose");

const webinarRegistrationSchema = new mongoose.Schema(
  {
    webinar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Mobile number must contain exactly 10 digits."],
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },

    // Address details
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },

    // Fee snapshot at registration time
    feeType: {
      type: String,
      enum: ["Free", "Paid"],
      required: true,
      default: "Free",
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

    // Payment proof
    transactionId: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },
    paymentScreenshotPath: {
      type: String,
      default: "",
    },

    // Payment review workflow
    paymentStatus: {
      type: String,
      enum: ["Not Required", "Pending Review", "Approved", "Rejected"],
      default: "Not Required",
      required: true,
    },
    adminComments: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    reviewedBy: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent the same email from registering twice for one webinar.
webinarRegistrationSchema.index(
  { webinar: 1, email: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "WebinarRegistration",
  webinarRegistrationSchema
);
