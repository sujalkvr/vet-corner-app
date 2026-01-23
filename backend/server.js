const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ============= MIDDLEWARE =============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

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
    
    // Make transporter available to all routes
    app.locals.transporter = transporter;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('⚠️  Server will continue but emails will not work');
  }
}

initializeTransporter();

// ============= MONGODB CONNECTION =============
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

// Import and use route modules
app.use('/api/appointment', require('./routes/appointment.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/admin', require('./routes/auth.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/products', require('./routes/product.routes.js'));
app.use('/api/team', require('./routes/teamRoutes'));

// ============= ERROR HANDLING =============
const multer = require('multer');

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
  console.log('\n📋 Available Routes:');
  console.log('   - POST /api/appointment/book');
  console.log('   - POST /api/payment/order');
  console.log('   - POST /api/admin/signin');
  console.log('   - GET  /api/blogs');
  console.log('   - POST /api/blogs (Protected)');
  console.log('   - GET  /api/notifications');
  console.log('   - POST /api/notifications (Protected)');
  console.log('   - GET  /api/products');
  console.log('   - POST /api/products (Protected)');
  console.log('   - GET  /api/team');           // ADD THIS LINE
  console.log('   - POST /api/team (Protected)'); // ADD THIS LINE

});