const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// ============= MULTER CONFIGURATIONS =============

// For appointment screenshots
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

// For blog images
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, 'blog-' + uniqueName);
  }
});

const blogUpload = multer({ 
  storage: blogStorage,
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

// For product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, 'product-' + uniqueName);
  }
});

const productUpload = multer({ 
  storage: productStorage,
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

// ============= EMAIL CONFIGURATION =============

let transporter;

async function initializeTransporter() {
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('⚠️  Server will continue but emails will not work');
  }
}

initializeTransporter();

// ============= MONGODB CONFIGURATION =============

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = require('./models/Blog');
const Notification = require('./models/Notification');
const Product = require('./models/Product'); 
// MongoDB Atlas Connection
// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log('📦 Database:', mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error('❌ MongoDB Atlas Connection Error:', err.message);
    console.error('💡 Check your connection string in .env file');
    process.exit(1);
  });

// ============= AUTH MIDDLEWARE =============

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.adminEmail = decoded.email;
    next();
  });
};

// ============= ROUTES =============

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    emailConfigured: !!transporter
  });
});

// ============= APPOINTMENT ROUTES =============

app.post('/api/appointment/book', appointmentUpload.single('screenshot'), async (req, res) => {
  try {
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

// ============= ADMIN BLOG ROUTES =============

// 1. Admin Sign In
app.post('/api/admin/signin', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true, 
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// 2. Get All Blogs (Public)
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ 
      message: 'Error fetching blogs', 
      error: error.message 
    });
  }
});

// 3. Get Single Blog by ID (Public)
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching blog', 
      error: error.message 
    });
  }
});

// 4. Create Blog (Protected)
app.post('/api/blogs', verifyToken, blogUpload.array('images', 3), async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and content are required' 
      });
    }
    
    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({ 
        success: false,
        message: 'Exactly 3 images are required' 
      });
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    const finalSlug = existingBlog ? `${slug}-${Date.now()}` : slug;
    
    const images = req.files.map(file => `/uploads/${file.filename}`);
    
    const blog = new Blog({ 
      title, 
      slug: finalSlug, 
      content, 
      images 
    });
    
    await blog.save();
    
    console.log('✅ Blog created:', blog.title);
    
    res.status(201).json({ 
      success: true, 
      message: 'Blog created successfully',
      blog 
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error creating blog', 
      error: error.message 
    });
  }
});

// 5. Delete Blog (Protected)
app.delete('/api/blogs/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }
    
    // Delete associated images
    blog.images.forEach(imgPath => {
      const filePath = path.join(__dirname, imgPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    
    console.log('🗑️ Blog deleted:', blog.title);
    
    res.json({ 
      success: true, 
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting blog', 
      error: error.message 
    });
  }
});
// 1. Get Active Notifications (Public)
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications', 
      error: error.message 
    });
  }
});

// 2. Get All Notifications (Protected - for admin)
app.get('/api/notifications/all', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications', 
      error: error.message 
    });
  }
});

// 3. Create Notification (Protected)
app.post('/api/notifications', verifyToken, blogUpload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        success: false,
        message: 'Content is required' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Image is required' 
      });
    }
    
    const image = `/uploads/${req.file.filename}`;
    
    const notification = new Notification({ 
      content, 
      image,
      isActive: true
    });
    
    await notification.save();
    
    console.log('✅ Notification created:', notification.content);
    
    res.status(201).json({ 
      success: true, 
      message: 'Notification created successfully',
      notification 
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error creating notification', 
      error: error.message 
    });
  }
});

// 4. Toggle Notification Active Status (Protected)
app.patch('/api/notifications/:id/toggle', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false,
        message: 'Notification not found' 
      });
    }
    
    notification.isActive = !notification.isActive;
    await notification.save();
    
    console.log(`🔄 Notification ${notification.isActive ? 'activated' : 'deactivated'}:`, notification.content);
    
    res.json({ 
      success: true, 
      message: `Notification ${notification.isActive ? 'activated' : 'deactivated'}`,
      notification 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error toggling notification', 
      error: error.message 
    });
  }
});

// 5. Delete Notification (Protected)
app.delete('/api/notifications/:id', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false,
        message: 'Notification not found' 
      });
    }
    
    // Delete associated image
    const filePath = path.join(__dirname, notification.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    console.log('🗑️ Notification deleted:', notification.content);
    
    res.json({ 
      success: true, 
      message: 'Notification deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting notification', 
      error: error.message 
    });
  }
});

// ============= PRODUCT ROUTES =============

// Get all products (public)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single product by slug (public)
app.get('/api/products/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get products by type (public)
app.get('/api/products/type/:type', async (req, res) => {
  try {
    const products = await Product.find({ type: req.params.type }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create product (admin only)
app.post('/api/products', verifyToken, productUpload.single('image'), async (req, res) => {
  try {
    const { name, type, description, price } = req.body;

    if (!name || !type || !description || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload a product image' 
      });
    }

    const validTypes = ['pet care', 'courses', 'others'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product type' 
      });
    }

    const product = new Product({
      name,
      image: '/uploads/' + req.file.filename,
      type,
      description,
      price: parseFloat(price)
    });

    await product.save();

    console.log('✅ Product created:', product.name);

    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully',
      product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update product (admin only)
app.put('/api/products/:id', verifyToken, productUpload.single('image'), async (req, res) => {
  try {
    const { name, type, description, price } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name) product.name = name;
    if (type) {
      const validTypes = ['pet care', 'courses', 'others'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid product type' });
      }
      product.type = type;
    }
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      product.image = '/uploads/' + req.file.filename;
    }

    // Regenerate slug if name changed
    if (name) {
      product.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();
    }

    await product.save();

    console.log('🔄 Product updated:', product.name);

    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      product 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete product image
    const imagePath = path.join(__dirname, product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(req.params.id);

    console.log('🗑️ Product deleted:', product.name);

    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============= ERROR HANDLING =============

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  }
  
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: error.message || 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// ============= START SERVER =============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadsDir}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`📊 API Docs: http://localhost:${PORT}/api/health`);
});