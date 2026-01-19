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

// ============= MULTER CONFIGURATION FOR PAYMENTS =============
const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + '-' + file.originalname);
  }
});

const paymentUpload = multer({ 
  storage: paymentStorage,
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

// ============= PAYMENT/ORDER ROUTE =============
router.post('/order', paymentUpload.single('screenshot'), async (req, res) => {
  try {
    // Get transporter from app locals
    const transporter = req.app.locals.transporter;
    
    if (!transporter) {
      return res.status(500).json({ 
        success: false, 
        message: 'Email service is not configured. Please contact administrator.' 
      });
    }

    const { 
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      comments,
      paymentId,
      productName,
      productType,
      productPrice,
      productId
    } = req.body;

    // Validation
    if (!name || !email || !phone || !address || !city || !state || !pincode || !paymentId || !productName || !productPrice) {
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
      subject: `🛒 NEW ORDER - ${productName} by ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #10b981; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 28px;">🛒 New Product Order</h2>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #f0fdf4; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">📦 Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857; width: 40%;">Product:</td>
                  <td style="padding: 12px 0; color: #1f2937;"><strong>${productName}</strong></td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Type:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${productType || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Price:</td>
                  <td style="padding: 12px 0; color: #1f2937;"><strong style="color: #10b981; font-size: 18px;">₹${Number(productPrice).toLocaleString('en-IN')}</strong></td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #047857;">Order ID:</td>
                  <td style="padding: 12px 0; color: #1f2937;"><code style="background: #fef3c7; padding: 4px 8px; border-radius: 4px;">${productId || 'N/A'}</code></td>
                </tr>
              </table>
            </div>

            <div style="background: #eff6ff; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">👤 Customer Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #dbeafe;">
                  <td style="padding: 12px 0; font-weight: bold; color: #1e40af; width: 40%;">Name:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #dbeafe;">
                  <td style="padding: 12px 0; font-weight: bold; color: #1e40af;">Email:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #dbeafe;">
                  <td style="padding: 12px 0; font-weight: bold; color: #1e40af;">Phone:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #dbeafe;">
                  <td style="padding: 12px 0; font-weight: bold; color: #1e40af;">Payment ID:</td>
                  <td style="padding: 12px 0; color: #1f2937;"><code style="background: #fef3c7; padding: 4px 8px; border-radius: 4px;">${paymentId}</code></td>
                </tr>
              </table>
            </div>

            <div style="background: #fef3c7; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 5px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">📍 Delivery Address</h3>
              <p style="color: #78716c; margin: 0; line-height: 1.8; font-size: 15px;">
                ${address}<br>
                ${city}, ${state} - ${pincode}<br>
                📞 ${phone}
              </p>
              ${comments ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #fbbf24;">
                  <p style="color: #92400e; margin: 0; font-weight: bold;">💬 Special Instructions:</p>
                  <p style="color: #78716c; margin: 5px 0 0 0;">${comments}</p>
                </div>
              ` : ''}
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
                🔔 Action Required: Verify payment & process order for shipping
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 13px; margin: 0;">
              🐾 <strong>Krish Vet Corner</strong> - Quality Pet Products<br>
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
      subject: '✅ Order Confirmed - Krish Vet Corner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #10b981; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 32px;">✅ Order Confirmed!</h2>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 18px; color: #1f2937; text-align: center; margin-bottom: 30px; line-height: 1.6;">
              Dear <strong>${name}</strong>,<br>
              Thank you for your purchase! 🎉<br>
              Your order has been received successfully.
            </p>
            
            <div style="background: #f0fdf4; padding: 25px; border-radius: 12px; border-left: 5px solid #10b981; margin-bottom: 25px;">
              <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px;">📦 Your Order:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 8px 0; color: #047857; font-weight: bold;">Product:</td>
                  <td style="padding: 8px 0; color: #1f2937; text-align: right;">${productName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #d1fae5;">
                  <td style="padding: 8px 0; color: #047857; font-weight: bold;">Type:</td>
                  <td style="padding: 8px 0; color: #1f2937; text-align: right;">${productType || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #047857; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 8px 0; color: #10b981; font-weight: bold; font-size: 20px; text-align: right;">₹${Number(productPrice).toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <div style="background: #eff6ff; padding: 25px; border-radius: 12px; border-left: 5px solid #3b82f6; margin-bottom: 25px;">
              <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">📍 Delivery Address:</h3>
              <p style="color: #1f2937; margin: 0; line-height: 1.8;">
                ${address}<br>
                ${city}, ${state} - ${pincode}<br>
                📞 ${phone}
              </p>
            </div>
            
            <div style="background: #fffbeb; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 2px dashed #fbbf24;">
              <h4 style="color: #92400e; margin-top: 0; margin-bottom: 10px;">⏳ What's Next?</h4>
              <p style="color: #78716c; margin: 0; line-height: 1.8;">
                Our team will verify your payment and ship your order within <strong>2-3 business days</strong>. 
                You'll receive tracking details via email once shipped.
              </p>
            </div>
            
            <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #ef4444;">
              <p style="color: #991b1b; font-weight: 500; margin: 0; line-height: 1.6;">
                ⚠️ <strong>Important:</strong> Keep your payment screenshot and this email safe. 
                Payment ID: <code style="background: #fef3c7; padding: 2px 6px; border-radius: 4px;">${paymentId}</code>
              </p>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h4 style="color: #374151; margin-top: 0; margin-bottom: 12px;">📞 Need Help?</h4>
              <p style="color: #6b7280; margin: 0; line-height: 1.8;">
                <strong>Krish Vet Corner</strong><br>
                Warsaw, Poland<br>
                📧 ${process.env.EMAIL_USER}<br>
                📞 ${phone}
              </p>
            </div>

            <div style="text-align: center; padding: 20px 0;">
              <p style="color: #059669; font-size: 18px; font-weight: bold; margin: 0;">
                Thank you for shopping with us! 🛒
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

    console.log('📧 Sending order confirmation emails...');
    await transporter.sendMail(adminMail);
    console.log('✅ Admin order notification sent');
    await transporter.sendMail(customerMail);
    console.log('✅ Customer order confirmation sent');

    res.json({ 
      success: true, 
      message: 'Order placed successfully! Check your email for confirmation.',
      data: {
        orderId: Date.now(),
        name,
        productName,
        totalAmount: productPrice,
        deliveryAddress: `${address}, ${city}, ${state} - ${pincode}`,
        screenshot: screenshotPath
      }
    });

  } catch (error) {
    console.error('❌ Order Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Order submission failed. Please try again or contact support.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;