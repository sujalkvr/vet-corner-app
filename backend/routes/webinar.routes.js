
const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Webinar = require("../models/Webinar");
const WebinarRegistration = require("../models/WebinarRegistration");
const cloudinary = require("../config/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (allowed.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Upload a JPG, PNG, WebP or GIF image."));
  },
});

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

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

// PUBLIC: List published webinars, with upcoming events first.
router.get("/", async (req, res) => {
  
try {
  const now = new Date();

  const webinars = await Webinar.find({
    isPublished: true,
    $or: [
      // Keep upcoming and ongoing webinars visible until they end.
      { endDate: { $gte: now } },

      // If no end date exists, keep the webinar until its start time.
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
    message: "Failed to fetch webinars",
  });
}
});

// ADMIN: List all webinars, including drafts and past events.
router.get("/admin/all", verifyToken, async (req, res) => {
  try {
    const webinars = await Webinar.find().sort({ date: -1 }).lean();

    res.json({ success: true, webinars });
  } catch (error) {
    console.error("Admin webinar list error:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch webinars.",
    });
  }
});

// ADMIN: List registrations for a webinar.
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

// PUBLIC: Get one published webinar.
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

// ADMIN: Create a webinar and upload its poster.
router.post(
  "/",
  verifyToken,
  upload.single("poster"),
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
      } = req.body;

      if (!title?.trim() || !description?.trim() ||
          !speakerName?.trim() || !date || !req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Title, description, speaker, date and poster are required.",
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

// ADMIN: Edit a webinar. A new poster is optional.
router.put(
  "/:id",
  verifyToken,
  upload.single("poster"),
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
      } = req.body;

      if (title !== undefined) webinar.title = title.trim();
      if (description !== undefined) {
        webinar.description = description.trim();
      }
      if (speakerName !== undefined) {
        webinar.speakerName = speakerName.trim();
      }
      if (speakerTitle !== undefined) {
        webinar.speakerTitle = speakerTitle.trim();
      }
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

// PUBLIC: Register for a published, upcoming webinar.
router.post("/:id/register", async (req, res) => {
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
     date: { $gte: new Date() } ,
    });

    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "This webinar is unavailable for registration.",
      });
    }

    const { name, position, email, mobile, gender, city, country } =
      req.body;

    if (
      !name?.trim() ||
      !position?.trim() ||
      !email?.trim() ||
      !mobile?.trim() ||
      !gender?.trim() ||
      !city?.trim() ||
      !country?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required registration fields.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    let registration;

    try {
      registration = await WebinarRegistration.create({
        webinar: webinar._id,
        name: name.trim(),
        position: position.trim(),
        email: normalizedEmail,
        mobile: mobile.trim(),
        gender: gender.trim(),
        city: city.trim(),
        country: country.trim(),
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "This email is already registered for this webinar.",
        });
      }
      throw error;
    }

    // The registration is saved even if the email service is temporarily down.
    const transporter = req.app.locals.transporter;
    let emailSent = false;

    if (transporter) {
      const safe = {
        name: escapeHtml(name.trim()),
        position: escapeHtml(position.trim()),
        email: escapeHtml(normalizedEmail),
        mobile: escapeHtml(mobile.trim()),
        gender: escapeHtml(gender.trim()),
        city: escapeHtml(city.trim()),
        country: escapeHtml(country.trim()),
        title: escapeHtml(webinar.title),
        speaker: escapeHtml(webinar.speakerName),
        date: escapeHtml(formatDate(webinar.date)),
      };

      const details = `
        <p><strong>Webinar:</strong> ${safe.title}</p>
        <p><strong>Speaker:</strong> ${safe.speaker}</p>
        <p><strong>Date:</strong> ${safe.date}</p>
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Position:</strong> ${safe.position}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Mobile:</strong> ${safe.mobile}</p>
        <p><strong>Gender:</strong> ${safe.gender}</p>
        <p><strong>City:</strong> ${safe.city}</p>
        <p><strong>Country:</strong> ${safe.country}</p>
      `;

      try {
        
await Promise.all([
  transporter.sendMail({
    from: '"Krish Vet Corner" <vetcorner2025@gmail.com>',
    to: process.env.ADMIN_EMAIL || "vetcorner2025@gmail.com",
    subject: `New webinar registration: ${webinar.title}`,
    html: `<h2>New webinar registration</h2>${details}`,
  }),
  transporter.sendMail({
    from: '"Krish Vet Corner" <vetcorner2025@gmail.com>',
    to: normalizedEmail,
    subject: `Registration received: ${webinar.title}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2>Registration received!</h2>
        <p>Hi ${safe.name},</p>
        <p>Your registration for <strong>${safe.title}</strong> has been received.</p>
        ${details}
        <p>Thank you for registering with Krish Vet Corner.</p>
      </div>
    `,
  }),
]);


        emailSent = true;
      } catch (emailError) {
        console.error("Webinar registration email error:", emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: emailSent
        ? "Registration successful. Check your email for confirmation."
        : "Registration saved, but email delivery could not be confirmed.",
      registrationId: registration._id,
      emailSent,
    });
  } catch (error) {
    console.error("Webinar registration error:", error);
    res.status(500).json({
      success: false,
      message: "Could not complete registration.",
    });
  }
});

// ADMIN: Delete a webinar but preserve registration history.
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

    // Registrations remain in MongoDB as historical records.
    // Cloudinary cleanup will be added with ownership checks.

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
