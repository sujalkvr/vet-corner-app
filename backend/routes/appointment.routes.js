const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ============= MULTER CONFIGURATION FOR APPOINTMENTS =============
const appointmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'appointment-' + uniqueSuffix + '-' + file.originalname);
  }
});

const appointmentUpload = multer({ 
  storage: appointmentStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ============= APPOINTMENT BOOKING ROUTE =============
router.post('/book', appointmentUpload.single('screenshot'), async (req, res) => {
  try {
    // Get transporter from app locals (we'll set this from server.js)
    const transporter = req.app.locals.transporter;
    
    if (!transporter) {
      return res.status(500).json({ 
        success: false, 
        message: 'Email service is not configured. Please contact administrator.' 
      });
    }

    const { 
      personName, 
      petName, 
      email, 
      phone, 
      serviceType, 
      description, 
      date, 
      altDate, 
      paymentId 
    } = req.body;

    if (!personName || !petName || !email || !phone || !serviceType || !date || !paymentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

    const screenshotPath = req.file ? `/uploads/${req.file.filename}` : null;
    const screenshotFullPath = req.file ? `${req.protocol}://${req.get('host')}${screenshotPath}` : null;

    // Email to admin
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🆕 NEW APPOINTMENT BOOKING - ${personName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #10b981; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 28px;">🐾 New Appointment Booking</h2>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #f0fdf4; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">📋 Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857; width: 40%;">Customer:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${personName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Pet Name:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${petName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Email:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Phone:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Service:</td>
                  <td style="padding: 12px 0; color: #1f2937;"><strong>${serviceType}</strong></td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Preferred Date:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${date}</td>
                </tr>
                ${altDate ? `
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Alternate Date:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${altDate}</td>
                </tr>
                ` : ''}
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Payment ID:</td>
                  <td style="padding: 12px 0; color: #1f2937;"><code style="background: #fef3c7; padding: 4px 8px; border-radius: 4px;">${paymentId}</code></td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: bold; color: #047857; vertical-align: top;">Pet Condition:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${description}</td>
                </tr>
              </table>
            </div>

            ${screenshotFullPath ? `
              <div style="background: #fffbeb; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px dashed #fbbf24;">
                <h4 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">📸 Payment Screenshot:</h4>
                <img src="${screenshotFullPath}" alt="Payment Proof" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 3px solid #ffffff;" />
                <p style="font-size: 12px; color: #78716c; margin-top: 10px; margin-bottom: 0;">Screenshot saved at: ${screenshotPath}</p>
              </div>
            ` : '<div style="background: #fee2e2; padding: 15px; border-radius: 8px; color: #991b1b; margin-bottom: 20px;">⚠️ No payment screenshot uploaded</div>'}

            <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 20px; border-radius: 12px; text-align: center; border: 2px solid #3b82f6;">
              <p style="color: #1e40af; font-weight: bold; font-size: 16px; margin: 0;">
                🔔 Action Required: Verify payment & confirm appointment
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 13px; margin: 0;">
              🐾 <strong>Krish Vet Corner</strong> - Professional Pet Care<br>
              Warsaw, Poland | <a href="mailto:${process.env.EMAIL_USER}" style="color: #10b981; text-decoration: none;">${process.env.EMAIL_USER}</a>
            </p>
          </div>
        </div>
      `,
      attachments: req.file ? [{
        filename: req.file.originalname,
        path: req.file.path
      }] : []
    };

    // Email to customer
    const customerMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Appointment Booked Successfully - Krish Vet Corner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #10b981; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 32px;">✅ Booking Confirmed!</h2>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 18px; color: #1f2937; text-align: center; margin-bottom: 30px; line-height: 1.6;">
              Dear <strong>${personName}</strong>,<br>
              Thank you for choosing Krish Vet Corner! 🐾<br>
              Your appointment for <strong style="color: #10b981;">${petName}</strong> has been received.
            </p>
            
            <div style="background: #f0fdf4; padding: 25px; border-radius: 12px; border-left: 5px solid #10b981; margin-bottom: 25px;">
              <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">📋 Your Appointment Details:</h3>
              <ul style="color: #047857; font-size: 16px; line-height: 2; padding-left: 20px;">
                <li><strong>Service:</strong> ${serviceType}</li>
                <li><strong>Preferred Date:</strong> ${date}</li>
                ${altDate ? `<li><strong>Alternate Date:</strong> ${altDate}</li>` : ''}
                <li><strong>Pet:</strong> ${petName}</li>
                <li><strong>Payment ID:</strong> <code style="background: #fef3c7; padding: 2px 6px; border-radius: 4px;">${paymentId}</code></li>
              </ul>
            </div>
            
            <div style="background: #fffbeb; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 2px dashed #fbbf24;">
              <h4 style="color: #92400e; margin-top: 0; margin-bottom: 10px;">⏳ What's Next?</h4>
              <p style="color: #78716c; margin: 0; line-height: 1.8;">
                Our team will verify your payment and send you a <strong>final confirmation email within 24 hours</strong>. 
                We'll also call you on <strong>${phone}</strong> to confirm the appointment time.
              </p>
            </div>
            
            <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #ef4444;">
              <p style="color: #991b1b; font-weight: 500; margin: 0; line-height: 1.6;">
                ⚠️ <strong>Important:</strong> Please keep your payment screenshot and this email safe. 
                You may need to show them at the clinic.
              </p>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h4 style="color: #374151; margin-top: 0; margin-bottom: 12px;">📍 Visit Us:</h4>
              <p style="color: #6b7280; margin: 0; line-height: 1.8;">
                <strong>Krish Vet Corner</strong><br>
                Warsaw, Poland<br>
                📞 ${phone}<br>
                📧 ${process.env.EMAIL_USER}
              </p>
            </div>

            <div style="text-align: center; padding: 20px 0;">
              <p style="color: #059669; font-size: 18px; font-weight: bold; margin: 0;">
                We look forward to caring for ${petName}! 🐾
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 13px; margin: 0;">
              This is an automated confirmation. Please do not reply to this email.<br>
              For queries, contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #10b981; text-decoration: none;">${process.env.EMAIL_USER}</a>
            </p>
          </div>
        </div>
      `
    };

    console.log('📧 Sending emails...');
    await transporter.sendMail(adminMail);
    console.log('✅ Admin email sent');
    await transporter.sendMail(customerMail);
    console.log('✅ Customer email sent');

    res.json({ 
      success: true, 
      message: 'Appointment booked successfully! Check your email for confirmation.',
      data: {
        bookingId: Date.now(),
        personName,
        petName,
        date,
        serviceType,
        screenshot: screenshotPath
      }
    });

  } catch (error) {
    console.error('❌ Booking Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Booking failed. Please try again or contact support.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;