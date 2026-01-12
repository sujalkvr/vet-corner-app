const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const slugify = require('slugify');  // ← REMOVED multer import

// GET 3 Featured Blogs (Homepage) ✅
router.get('/featured', async (req, res) => {
  try {
    const blogs = await Blog.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title slug featuredImages rating readTime');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET All Blogs (/blog page) ✅
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title slug featuredImages contentImage rating readTime createdAt');
    const total = await Blog.countDocuments();
    res.json({ blogs, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Single Blog ✅
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE Blog (TEMP - No upload for now) ✅
router.post('/', async (req, res) => {
  try {
    const { title, content, isFeatured } = req.body;
    const slug = slugify(title, { lower: true });
    
    const blog = new Blog({
      title,
      slug,
      content,
      featuredImages: ['/images/blog1-1.jpg', '/images/blog1-2.jpg', '/images/blog1-3.jpg'], // Default
      contentImage: '/images/blog1-1.jpg',
      isFeatured: isFeatured === 'true'
    });

    await blog.save();
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Blog Featured Status ✅
router.patch('/:id/feature', async (req, res) => {
  try {
    const { isFeatured } = req.body;
    
    if (isFeatured === 'true') {
      await Blog.updateMany({ isFeatured: true }, { isFeatured: false });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { isFeatured: isFeatured === 'true' },
      { new: true }
    );
    
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
