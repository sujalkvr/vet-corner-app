
const express = require("express");
const router = express.Router();

const multer = require("multer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const Webinar = require("../models/Webinar");
const WebinarRegistration = require("../models/WebinarRegistration");
const cloudinary = require("../config/cloudinary");

// =====================================================
// DIRECTORIES
// =====================================================

// Payment proofs are stored separately from public /uploads.
const privateUploadsDir = path.join(
  __dirname,
  "../private-webinar-proofs"
);

if (!fs.existsSync(privateUploadsDir)) {
  fs.mkdirSync(privateUploadsDir, { recursive: true });
}

// =====================================================
// MULTER CONFIGURATION
// =====================================================

// Webinar poster uploads remain in memory for Cloudinary.
const posterUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (allowed.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Upload a JPG, PNG, WebP or GIF image."));
  },
});

// Payment proofs are stored privately on the server.
const paymentProofUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, privateUploadsDir);
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();

      cb(
        null,
        `webinar-proof-${Date.now()}-${crypto.randomUUID()}${extension}`
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (
      allowedExtensions.includes(extension) &&
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.mimetype
      )
    ) {
      return cb(null, true);
    }

    cb(new Error("Upload a JPG, PNG, WebP or GIF payment screenshot."));
  },
});

// =====================================================
// AUTHENTICATION
// =====================================================

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired admin token.",
      });
    }

    req.adminEmail = decoded.email;
    next();
  });
};

// =====================================================
// HELPERS
// =====================================================

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

const formatDate = (date, timeZone = "Asia/Kolkata") =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone,
  });

const uploadPosterToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "webinars",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });

const deletePrivateProof = (filename) => {
  if (!filename) return;

  // Only allow deleting a file directly inside the private directory.
  const safeName = path.basename(filename);
  const fullPath = path.join(privateUploadsDir, safeName);

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, () => {});
  }
};

const sendEmail = async (transporter, mail) => {
  if (!transporter) {
    return false;
  }

  try {
    await transporter.sendMail(mail);
    return true;
  } catch (error) {
    console.error("Webinar email error:", error.message);
    return false;
  }
};

const getSender = () =>
  '"Krish Vet Corner" <vetcorner2025@gmail.com>';

const getAdminEmail = () =>
  process.env.ADMIN_EMAIL || "vetcorner2025@gmail.com";

const normalizeFee = (feeType, feeLabel, feeAmount) => {
  const type = feeType || "Free";

  if (!["Free", "Paid"].includes(type)) {
    throw new Error("Fee type must be Free or Paid.");
  }

  const label = String(feeLabel || "").trim();
  const amount = feeAmount === "" || feeAmount == null
    ? 0
    : Number(feeAmount);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Enter a valid webinar fee.");
  }

  if (type === "Paid" && amount <= 0) {
    throw new Error("Paid webinars must have a fee greater than zero.");
  }

  return {
    feeType: type,
    feeLabel: type === "Free" ? label : "",
    feeAmount: type === "Paid" ? amount : 0,
  };
};

const registrationDetailsHtml = (registration, webinar) => {
  const fields = [
    ["Webinar", webinar.title],
    ["Date", formatDate(webinar.date, webinar.timeZone)],
    ["Name", registration.name],
    ["Position", registration.position],
    ["Email", registration.email],
    ["Mobile", registration.mobile],
    ["Address", registration.address],
    ["City", registration.city],
    ["Country", registration.country],
    ["Fee type", registration.feeType],
    [
      "Fee",
      registration.feeType === "Paid"
        ? `₹${registration.feeAmount}`
        : registration.feeLabel || "Free",
    ],
    ["Transaction ID", registration.transactionId || "Not applicable"],
  ];

  return fields
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value || "")}</p>`
    )
    .join("");
};

// =====================================================
// PUBLIC: LIST UPCOMING AND ONGOING WEBINARS
// =====================================================

router.get("/", async (req, res) => {
  try {
    const now = new Date();

    const webinars = await Webinar.find({
      isPublished: true,
      $or: [
        { endDate: { $gte: now } },
        {
          endDate: null,
          date: { $gte: now },
        },
      ],
    })
      .sort({ date: 1 })
      .lean();

    res.json({ success: true, webinars });
  } catch (error) {
    console.error("Error fetching public webinars:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch webinars.",
    });
  }
});

// =====================================================
// ADMIN: LIST ALL WEBINARS
// =====================================================

router.get("/admin/all", verifyToken, async (req, res) => {
  try {
    const webinars = await Webinar.find()
      .sort({ date: -1 })
      .lean();

    res.json({ success: true, webinars });
  } catch (error) {
    console.error("Admin webinar list error:", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch webinars.",
    });
  }
});

// =====================================================
// ADMIN: LIST REGISTRATIONS FOR ONE WEBINAR
// =====================================================

router.get("/:id/registrations", verifyToken, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webinar ID.",
      });
    }

    const registrations = await WebinarRegistration.find({
      webinar: req.params.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, registrations });
  } catch (error) {
    console.error("Fetch registrations error:", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch registrations.",
    });
  }
});

// =====================================================
// ADMIN: VIEW A PRIVATE PAYMENT SCREENSHOT
// =====================================================

router.get(
  "/:id/registrations/:registrationId/payment-proof",
  verifyToken,
  async (req, res) => {
    try {
      const { id, registrationId } = req.params;

      if (
        !mongoose.isValidObjectId(id) ||
        !mongoose.isValidObjectId(registrationId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid webinar or registration ID.",
        });
      }

      const registration = await WebinarRegistration.findOne({
        _id: registrationId,
        webinar: id,
      }).lean();

      if (!registration || !registration.paymentScreenshotPath) {
        return res.status(404).json({
          success: false,
          message: "Payment screenshot not found.",
        });
      }

      const filename = path.basename(registration.paymentScreenshotPath);
      const fullPath = path.join(privateUploadsDir, filename);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          success: false,
          message: "Payment screenshot file is unavailable.",
        });
      }

      const extension = path.extname(filename).toLowerCase();

      const contentTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
      };

      res.setHeader(
        "Content-Type",
        contentTypes[extension] || "application/octet-stream"
      );
      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("X-Content-Type-Options", "nosniff");

      res.sendFile(fullPath);
    } catch (error) {
      console.error("Payment proof access error:", error);

      res.status(500).json({
        success: false,
        message: "Could not retrieve payment proof.",
      });
    }
  }
);

// =====================================================
// ADMIN: APPROVE OR REJECT A PAID REGISTRATION
// =====================================================

router.patch(
  "/:id/registrations/:registrationId/review",
  verifyToken,
  async (req, res) => {
    try {
      const { id, registrationId } = req.params;
      const { status, comments = "" } = req.body;

      if (
        !mongoose.isValidObjectId(id) ||
        !mongoose.isValidObjectId(registrationId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid webinar or registration ID.",
        });
      }

      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be Approved or Rejected.",
        });
      }

      if (
        typeof comments !== "string" ||
        comments.length > 2000
      ) {
        return res.status(400).json({
          success: false,
          message: "Comments must not exceed 2000 characters.",
        });
      }

      const registration = await WebinarRegistration.findOne({
        _id: registrationId,
        webinar: id,
      });

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: "Registration not found for this webinar.",
        });
      }

      if (registration.feeType !== "Paid") {
        return res.status(400).json({
          success: false,
          message: "Payment review is only available for paid registrations.",
        });
      }

      if (registration.paymentStatus !== "Pending Review") {
        return res.status(409).json({
          success: false,
          message: "This registration has already been reviewed.",
        });
      }

      const webinar = await Webinar.findById(id);

      if (!webinar) {
        return res.status(404).json({
          success: false,
          message: "Webinar not found.",
        });
      }

      registration.paymentStatus = status;
      registration.adminComments = comments.trim();
      registration.reviewedBy = req.adminEmail;
      registration.reviewedAt = new Date();

      await registration.save();

      const transporter = req.app.locals.transporter;

      const safeName = escapeHtml(registration.name);
      const safeTitle = escapeHtml(webinar.title);
      const safeComments = escapeHtml(comments.trim());

      const emailSent = await sendEmail(transporter, {
        from: getSender(),
        to: registration.email,
        subject: `Webinar payment ${status.toLowerCase()}: ${webinar.title}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
            <h2>Payment review update</h2>
            <p>Hi ${safeName},</p>
            <p>Your payment submission for <strong>${safeTitle}</strong>
            has been <strong>${status.toLowerCase()}</strong>.</p>
            ${
              status === "Approved"
                ? "<p>Your payment has been approved. Thank you for registering!</p>"
                : "<p>Your payment has not been approved. Please review the organizer's comments below.</p>"
            }
            ${
              safeComments
                ? `<p><strong>Admin comments:</strong></p><p>${safeComments}</p>`
                : ""
            }
            <p>Krish Vet Corner</p>
          </div>
        `,
      });

      res.json({
        success: true,
        message: emailSent
          ? `Registration ${status.toLowerCase()} and attendee notified.`
          : `Registration ${status.toLowerCase()}, but email delivery could not be confirmed.`,
        emailSent,
        registration,
      });
    } catch (error) {
      console.error("Payment review error:", error);

      res.status(500).json({
        success: false,
        message: "Could not review this registration.",
      });
    }
  }
);

// =====================================================
// PUBLIC: GET ONE PUBLISHED WEBINAR
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webinar ID.",
      });
    }

    const webinar = await Webinar.findOne({
      _id: req.params.id,
      isPublished: true,
    }).lean();

    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found.",
      });
    }

    res.json({ success: true, webinar });
  } catch (error) {
    console.error("Fetch webinar error:", error);

    res.status(500).json({
      success: false,
      message: "Could not fetch webinar.",
    });
  }
});

// =====================================================
// ADMIN: CREATE A WEBINAR
// =====================================================

router.post(
  "/",
  verifyToken,
  posterUpload.single("poster"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        speakerName,
        speakerTitle,
        date,
        endDate,
        timeZone,
        registrationLink,
        isPublished,
        feeType,
        feeLabel,
        feeAmount,
      } = req.body;

      if (
        !title?.trim() ||
        !description?.trim() ||
        !speakerName?.trim() ||
        !date ||
        !req.file
      ) {
        return res.status(400).json({
          success: false,
          message: "Title, description, speaker, date and poster are required.",
        });
      }

      if (Number.isNaN(Date.parse(date))) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid webinar date and time.",
        });
      }

      if (endDate && Number.isNaN(Date.parse(endDate))) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid end date and time.",
        });
      }

      if (endDate && new Date(endDate) < new Date(date)) {
        return res.status(400).json({
          success: false,
          message: "The end time must be after the start time.",
        });
      }

      let fee;

      try {
        fee = normalizeFee(feeType, feeLabel, feeAmount);
      } catch (feeError) {
        return res.status(400).json({
          success: false,
          message: feeError.message,
        });
      }

      const poster = await uploadPosterToCloudinary(req.file);

      const webinar = await Webinar.create({
        title: title.trim(),
        description: description.trim(),
        speakerName: speakerName.trim(),
        speakerTitle: speakerTitle?.trim() || "",
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        timeZone: timeZone || "Asia/Kolkata",
        registrationLink: registrationLink?.trim() || "",
        posterUrl: poster.url,
        cloudinaryPublicId: poster.publicId,
        isPublished: isPublished === "true",
        ...fee,
      });

      res.status(201).json({
        success: true,
        message: "Webinar created successfully.",
        webinar,
      });
    } catch (error) {
      console.error("Create webinar error:", error);

      res.status(500).json({
        success: false,
        message: "Could not create webinar.",
      });
    }
  }
);

// =====================================================
// ADMIN: EDIT A WEBINAR
// =====================================================

router.put(
  "/:id",
  verifyToken,
  posterUpload.single("poster"),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid webinar ID.",
        });
      }

      const webinar = await Webinar.findById(req.params.id);

      if (!webinar) {
        return res.status(404).json({
          success: false,
          message: "Webinar not found.",
        });
      }

      const {
        title,
        description,
        speakerName,
        speakerTitle,
        date,
        endDate,
        timeZone,
        registrationLink,
        isPublished,
        feeType,
        feeLabel,
        feeAmount,
      } = req.body;

      if (title !== undefined) webinar.title = title.trim();
      if (description !== undefined) webinar.description = description.trim();
      if (speakerName !== undefined) webinar.speakerName = speakerName.trim();
      if (speakerTitle !== undefined) webinar.speakerTitle = speakerTitle.trim();

      if (date !== undefined) {
        if (Number.isNaN(Date.parse(date))) {
          return res.status(400).json({
            success: false,
            message: "Enter a valid webinar date and time.",
          });
        }

        webinar.date = new Date(date);
      }

      if (endDate !== undefined) {
        if (endDate && Number.isNaN(Date.parse(endDate))) {
          return res.status(400).json({
            success: false,
            message: "Enter a valid end date and time.",
          });
        }

        webinar.endDate = endDate ? new Date(endDate) : null;
      }

      if (timeZone !== undefined) webinar.timeZone = timeZone;
      if (registrationLink !== undefined) {
        webinar.registrationLink = registrationLink.trim();
      }
      if (isPublished !== undefined) {
        webinar.isPublished = isPublished === "true";
      }

      const currentFeeType = webinar.feeType || "Free";
      const currentFeeAmount = webinar.feeAmount ?? 0;
      const currentFeeLabel = webinar.feeLabel || "";

      let fee;

      try {
        fee = normalizeFee(
          feeType !== undefined ? feeType : currentFeeType,
          feeLabel !== undefined ? feeLabel : currentFeeLabel,
          feeAmount !== undefined ? feeAmount : currentFeeAmount
        );
      } catch (feeError) {
        return res.status(400).json({
          success: false,
          message: feeError.message,
        });
      }

      Object.assign(webinar, fee);

      if (req.file) {
        const poster = await uploadPosterToCloudinary(req.file);
        webinar.posterUrl = poster.url;
        webinar.cloudinaryPublicId = poster.publicId;
      }

      if (webinar.endDate && webinar.endDate < webinar.date) {
        return res.status(400).json({
          success: false,
          message: "The end time must be after the start time.",
        });
      }

      await webinar.save();

      res.json({
        success: true,
        message: "Webinar updated successfully.",
        webinar,
      });
    } catch (error) {
      console.error("Update webinar error:", error);

      res.status(500).json({
        success: false,
        message: "Could not update webinar.",
      });
    }
  }
);

// =====================================================
// PUBLIC: REGISTER FOR A WEBINAR
// =====================================================

router.post(
  "/:id/register",
  paymentProofUpload.single("screenshot"),
  async (req, res) => {
    let uploadedProof = req.file?.filename;

    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        if (uploadedProof) deletePrivateProof(uploadedProof);

        return res.status(400).json({
          success: false,
          message: "Invalid webinar ID.",
        });
      }

      const webinar = await Webinar.findOne({
        _id: req.params.id,
        isPublished: true,
        date: { $gte: new Date() },
      });

      if (!webinar) {
        if (uploadedProof) deletePrivateProof(uploadedProof);

        return res.status(404).json({
          success: false,
          message: "This webinar is unavailable for registration.",
        });
      }

      const {
        name,
        position,
        email,
        mobile,
        gender,
        address,
        city,
        country,
        transactionId,
      } = req.body;

      if (
        !name?.trim() ||
        !position?.trim() ||
        !email?.trim() ||
        !mobile?.trim() ||
        !gender?.trim() ||
        !address?.trim() ||
        !city?.trim() ||
        !country?.trim()
      ) {
        if (uploadedProof) deletePrivateProof(uploadedProof);

        return res.status(400).json({
          success: false,
          message: "Please complete all required registration fields.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedMobile = mobile.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        if (uploadedProof) deletePrivateProof(uploadedProof);

        return res.status(400).json({
          success: false,
          message: "Enter a valid email address.",
        });
      }

      if (!/^\d{10}$/.test(normalizedMobile)) {
        if (uploadedProof) deletePrivateProof(uploadedProof);

        return res.status(400).json({
          success: false,
          message: "Mobile number must contain exactly 10 digits.",
        });
      }

      // Older webinars without fee fields are treated as free.
      const feeType = webinar.feeType || "Free";
      const feeAmount = feeType === "Paid" ? webinar.feeAmount : 0;
      const feeLabel = feeType === "Free" ? webinar.feeLabel || "" : "";

      if (feeType === "Paid") {
        if (!Number.isFinite(feeAmount) || feeAmount <= 0) {
          if (uploadedProof) deletePrivateProof(uploadedProof);

          return res.status(400).json({
            success: false,
            message: "This paid webinar has an invalid fee configuration.",
          });
        }

        if (!transactionId?.trim()) {
          if (uploadedProof) deletePrivateProof(uploadedProof);

          return res.status(400).json({
            success: false,
            message: "Enter your payment transaction ID.",
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Upload your payment screenshot.",
          });
        }
      } else if (uploadedProof) {
        deletePrivateProof(uploadedProof);
        uploadedProof = null;
      }

      let registration;

      try {
        registration = await WebinarRegistration.create({
          webinar: webinar._id,
          name: name.trim(),
          position: position.trim(),
          email: normalizedEmail,
          mobile: normalizedMobile,
          gender: gender.trim(),
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),

          feeType,
          feeLabel,
          feeAmount,

          transactionId:
            feeType === "Paid" ? transactionId.trim() : "",
          paymentScreenshotPath:
            feeType === "Paid" ? uploadedProof : "",

          paymentStatus:
            feeType === "Paid" ? "Pending Review" : "Not Required",
        });
      } catch (error) {
        if (uploadedProof) deletePrivateProof(uploadedProof);

        if (error.code === 11000) {
          return res.status(409).json({
            success: false,
            message: "This email is already registered for this webinar.",
          });
        }

        throw error;
      }

      const transporter = req.app.locals.transporter;
      const details = registrationDetailsHtml(registration, webinar);
      const safeName = escapeHtml(registration.name);
      const safeTitle = escapeHtml(webinar.title);

      let adminEmailSent = false;
      let attendeeEmailSent = false;

      // Every registration triggers an admin notification.
      adminEmailSent = await sendEmail(transporter, {
        from: getSender(),
        to: getAdminEmail(),
        subject: `New ${feeType.toLowerCase()} webinar registration: ${webinar.title}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
            <h2>New webinar registration</h2>
            ${details}
            ${
              feeType === "Paid"
                ? "<p><strong>Action required:</strong> Review the payment proof in the admin dashboard.</p>"
                : "<p>This is a free registration. No payment review is required.</p>"
            }
          </div>
        `,
      });

      // Free attendees receive a registration confirmation.
      // Paid attendees receive their decision email after admin review.
      if (feeType === "Free") {
        attendeeEmailSent = await sendEmail(transporter, {
          from: getSender(),
          to: normalizedEmail,
          subject: `Registration received: ${webinar.title}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <h2>Registration successful!</h2>
              <p>Hi ${safeName},</p>
              <p>Your registration for <strong>${safeTitle}</strong> has been received.</p>
              ${details}
              <p>Thank you for registering with Krish Vet Corner.</p>
            </div>
          `,
        });
      }

      res.status(201).json({
        success: true,
        message:
          feeType === "Paid"
            ? "Registration received. Your payment is pending admin review."
            : "Free registration completed.",
        registrationId: registration._id,
        paymentStatus: registration.paymentStatus,
        adminEmailSent,
        attendeeEmailSent,
      });
    } catch (error) {
      console.error("Webinar registration error:", error);

      if (uploadedProof) deletePrivateProof(uploadedProof);

      res.status(500).json({
        success: false,
        message: "Could not complete registration.",
      });
    }
  }
);

// =====================================================
// ADMIN: DELETE A WEBINAR
// =====================================================

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webinar ID.",
      });
    }

    const webinar = await Webinar.findByIdAndDelete(req.params.id);

    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found.",
      });
    }

    // Preserve registrations as historical records.
    // Existing Cloudinary poster cleanup remains separate.

    res.json({
      success: true,
      message: "Webinar deleted. Registration history has been preserved.",
    });
  } catch (error) {
    console.error("Delete webinar error:", error);

    res.status(500).json({
      success: false,
      message: "Could not delete webinar.",
    });
  }
});

module.exports = router;
