const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Team = require('../models/Team');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/team';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'team-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// GET all team members
router.get('/', async (req, res) => {
  try {
    const teamMembers = await Team.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single team member
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    res.json({ success: true, data: teamMember });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// CREATE new team member
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, degree, description, order } = req.body;
    
    if (!name || !degree || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, degree, and description' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload an image' 
      });
    }
    
    const teamMember = new Team({
      name,
      degree,
      description,
      image: `/uploads/team/${req.file.filename}`,
      order: order || 0
    });
    
    await teamMember.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Team member added successfully',
      data: teamMember 
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    
    // Delete uploaded file if database save fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE team member
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, degree, description, order } = req.body;
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    // Update fields
    if (name) teamMember.name = name;
    if (degree) teamMember.degree = degree;
    if (description) teamMember.description = description;
    if (order !== undefined) teamMember.order = order;
    
    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', teamMember.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      teamMember.image = `/uploads/team/${req.file.filename}`;
    }
    
    await teamMember.save();
    
    res.json({ 
      success: true, 
      message: 'Team member updated successfully',
      data: teamMember 
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    
    // Delete uploaded file if update fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE team member
router.delete('/:id', async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    // Delete image file
    const imagePath = path.join(__dirname, '..', teamMember.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await Team.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Team member deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;