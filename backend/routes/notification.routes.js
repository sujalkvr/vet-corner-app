const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

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

// 3. Create Notification (Protected) - NO IMAGE
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        success: false,
        message: 'Content is required' 
      });
    }
    
    const notification = new Notification({ 
      content,
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