const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/Blog');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ============= MULTER CONFIGURATION FOR BLOGS =============
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

// ============= BLOG ROUTES =============

// 1. Get All Blogs (Public)
router.get('/', async (req, res) => {
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

// 2. Get Single Blog by ID (Public)
router.get('/:id', async (req, res) => {
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

// 3. Create Blog (Protected)
router.post('/', verifyToken, blogUpload.array('images', 3), async (req, res) => {
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

// 4. Delete Blog (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
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
      const filePath = path.join(__dirname, '..', imgPath);
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
    console.error('Error deleting blog:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting blog', 
      error: error.message 
    });
  }
});

module.exports = router;