export const API_BASE_URL = 'http://localhost:5000/api';

export const ADMIN_CREDENTIALS = {
  email: 'admin@krishvet.com',
  password: 'krish123admin'
};

export const BLOG_IMAGE_SIZES = {
  featured: '1200x400',  // Slider images
  content: '1200x600'    // Article header
};

export const ROUTES = {
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_BLOGS_NEW: '/admin/blogs/new',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug'
};

// Blog default values
export const DEFAULT_BLOG_DATA = {
  rating: 5.0,
  readTime: '3 min',
  featuredImages: ['/images/blog-placeholder-1.jpg', '/images/blog-placeholder-2.jpg', '/images/blog-placeholder-3.jpg']
};
