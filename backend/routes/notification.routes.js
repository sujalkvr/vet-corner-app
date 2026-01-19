const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Notification = require('../models/Notification');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ============= MULTER CONFIGURATION FOR NOTIFICATIONS =============
const notificationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, 'notification-' + uniqueName);
  }
});

const notificationUpload = multer({ 
  storage: notificationStorage,
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

// ============= AUTH MIDDLEWARE =============
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.adminEmail = decoded.email;
    next();
  });
};

// ============= NOTIFICATION ROUTES =============

// 1. Get Active Notifications (Public)
router.get('/', async (req, res) => {
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
router.get('/all', verifyToken, async (req, res) => {
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
router.post('/', verifyToken, notificationUpload.single('image'), async (req, res) => {
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
router.patch('/:id/toggle', verifyToken, async (req, res) => {
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
    console.error('Error toggling notification:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error toggling notification', 
      error: error.message 
    });
  }
});

// 5. Delete Notification (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false,
        message: 'Notification not found' 
      });
    }
    
    // Delete associated image
    const filePath = path.join(__dirname, '..', notification.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    console.log('🗑️ Notification deleted:', notification.content);
    
    res.json({ 
      success: true, 
      message: 'Notification deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting notification', 
      error: error.message 
    });
  }
});

module.exports = router;