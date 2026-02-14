// src/components/AllBlogs.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import { API_URL } from '../api';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        
        const data = await response.json();
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl inline-block">
            <p className="font-semibold">Unable to load blogs</p>
            <p className="text-sm mt-2">Please check if the server is running</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
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
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-all duration-300 hover:translate-x-[-4px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            All Blog Posts
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed">
            Expert pet care advice and tips from Dr. Krish Nayak
          </p>
          <div className="mt-6 inline-block px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
            {blogs.length} {blogs.length === 1 ? 'Article' : 'Articles'}
          </div>
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-8 py-6 rounded-2xl inline-block">
              <p className="font-semibold text-lg">No blogs available yet</p>
              <p className="text-sm mt-2">Check back soon for new content!</p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                className="group cursor-pointer bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-emerald-400/40 overflow-hidden border border-emerald-200/50 hover:-translate-y-3 transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Blog Image */}
                <div className="relative h-64 overflow-hidden">
                  {blog.images && blog.images.length > 0 ? (
                    <img
                      src={`${API_URL}/${blog.images[0].replace(/^\/+/, '')}`}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-white text-6xl">🐾</span>
                    </div>
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                    <div className="flex items-center space-x-2 text-white font-bold text-lg">
                      <span>Read Article</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-gray-700">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {blog.content}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center text-emerald-600 font-bold group-hover:text-emerald-700 transition-all duration-300">
                    <span>Read More</span>
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button at Bottom */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;