// src/components/BlogDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { API_URL } from '../api';
const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        
        const data = await response.json();
        const foundBlog = data.find(b => b.slug === slug);
        
        if (!foundBlog) {
          setError('Blog not found');
        } else {
          setBlog(foundBlog);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Auto-slide images
  useEffect(() => {
    if (!blog || !blog.images || blog.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % blog.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-8">Blog not found</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      {/* Back Button - Fixed at top */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-all duration-300 hover:translate-x-[-4px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span className="font-medium">
                {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span className="font-medium">5 min read</span>
            </div>
            <div className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              Dr. Krish Nayak
            </div>
          </div>
        </header>

        {/* Featured Image Slider */}
        {blog.images && blog.images.length > 0 && (
          <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-96 md:h-[500px] lg:h-[600px]">
              {blog.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${API_URL}/${img.replace(/^\/+/, '')}`}
                  alt={`${blog.title} - Image ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                    idx === currentImageIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/1200x600?text=Blog+Image';
                  }}
                />
              ))}
              
              {/* Image Navigation Dots */}
              {blog.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/60 backdrop-blur-xl py-3 px-5 rounded-full">
                  {blog.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex
                          ? 'bg-emerald-400 scale-125 shadow-lg'
                          : 'bg-white/70 hover:bg-emerald-300 hover:scale-110'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {blog.content}
            </div>
          </div>
        </div>

        {/* Back to Blogs Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/#blog')}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Blogs
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;