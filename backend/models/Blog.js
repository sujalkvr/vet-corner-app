const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  featuredImages: [{ type: String, required: true }], // 3 slider images
  contentImage: { type: String }, // 4th image for article
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  readTime: { type: String, default: '2 min' },
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
