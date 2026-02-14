import { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight, Star, FileText, ChevronLeft } from 'lucide-react';
import { API_URL } from '../api';
import { Link } from 'react-router-dom';
const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeSliders, setActiveSliders] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        
        const data = await response.json();
        
        // Take only the 3 most recent blogs
        const recentBlogs = data.slice(0, 3);
        setBlogs(recentBlogs);
        
        // Initialize sliders for each blog
        const initialSliders = {};
        recentBlogs.forEach((_, index) => {
          initialSliders[index] = 0;
        });
        setActiveSliders(initialSliders);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Auto-slide for each card's images
  useEffect(() => {
    if (blogs.length === 0) return;

    const intervals = blogs.map((_, index) => {
      return setInterval(() => {
        setActiveSliders(prev => ({
          ...prev,
          [index]: (prev[index] + 1) % 3
        }));
      }, 3000);
    });

    return () => intervals.forEach(clearInterval);
  }, [blogs]);

  const handlePreviousMobile = () => {
    setCurrentIndex((prev) => (prev === 0 ? blogs.length - 1 : prev - 1));
  };

  const handleNextMobile = () => {
    setCurrentIndex((prev) => (prev === blogs.length - 1 ? 0 : prev + 1));
  };

  // Loading state
  if (loading) {
    return (
      <section id="blog" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-4 sm:mb-6 px-4">
              Pet Care Blog
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed px-4">
              Latest articles from Dr. Krish Nayak
            </p>
          </div>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-emerald-500"></div>
            <p className="mt-4 text-gray-600 text-base sm:text-lg">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="blog" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-4 sm:mb-6 px-4">
              Pet Care Blog
            </h2>
          </div>
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-6 py-4 rounded-xl inline-block">
              <p className="font-semibold text-sm sm:text-base">Unable to load blogs</p>
              <p className="text-xs sm:text-sm mt-2">Please check if the server is running</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No blogs state
  if (blogs.length === 0) {
    return (
      <section id="blog" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-4 sm:mb-6 px-4">
              Pet Care Blog
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed px-4">
              Latest articles from Dr. Krish Nayak
            </p>
          </div>
          <div className="text-center py-12">
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 sm:px-6 py-4 rounded-xl inline-block">
              <p className="font-semibold text-sm sm:text-base">No blogs available yet</p>
              <p className="text-xs sm:text-sm mt-2">Check back soon for new content!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-4 sm:mb-6 px-4">
            Pet Care Blog
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed px-4">
            Latest articles from Dr. Krish Nayak
          </p>
        </div>

        {/* Desktop View - 3 Cards Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 lg:gap-12 mb-12 sm:mb-20">
          {blogs.map((blog, index) => (
            <div key={blog._id} className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-emerald-400/40 overflow-hidden border border-emerald-200/50 hover:-translate-y-4 transition-all duration-700 hover:scale-[1.02]">
              
              {/* Image Slider */}
              <div className="relative h-80 overflow-hidden rounded-t-3xl">
                {blog.images && blog.images.length > 0 ? (
                  <>
                    {blog.images.map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={`${API_URL}${img}`}
                        alt={blog.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                          imgIdx === activeSliders[index]
                            ? 'opacity-100 scale-100 shadow-2xl'
                            : 'opacity-0 scale-110 blur-sm'
                        }`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Image';
                        }}
                      />
                    ))}
                    
                    {/* Slider Dots */}
                    {blog.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/60 backdrop-blur-xl py-2 px-4 rounded-2xl">
                        {blog.images.map((_, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={() => setActiveSliders(prev => ({ ...prev, [index]: imgIdx }))}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              imgIdx === activeSliders[index]
                                ? 'bg-emerald-400 scale-125 shadow-md'
                                : 'bg-white/70 hover:bg-emerald-300 hover:scale-110'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-6xl">🐾</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors duration-500">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {blog.content}
                </p>
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-2 font-semibold text-sm text-gray-700">(5.0)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 text-sm font-semibold">
                    <FileText className="w-4 h-4" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center text-emerald-600 font-bold text-lg hover:text-emerald-700 transition-all duration-300 hover:translate-x-2"
                >
                  Read More
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet View - 1 Card Carousel */}
        <div className="lg:hidden relative mb-12">
          {/* Navigation Buttons */}
          <button
            onClick={handlePreviousMobile}
            className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-emerald-500 hover:text-white text-emerald-600"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={handleNextMobile}
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-emerald-500 hover:text-white text-emerald-600"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Single Card Display */}
          <div className="px-12 sm:px-16">
            <div className="group relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-emerald-200/50">
              
              {/* Image Slider */}
              <div className="relative h-64 sm:h-72 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                {blogs[currentIndex].images && blogs[currentIndex].images.length > 0 ? (
                  <>
                    {blogs[currentIndex].images.map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={`${API_URL}${img}`}
                        alt={blogs[currentIndex].title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                          imgIdx === activeSliders[currentIndex]
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-110'
                        }`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Image';
                        }}
                      />
                    ))}
                    
                    {/* Slider Dots */}
                    {blogs[currentIndex].images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/60 backdrop-blur-xl py-1.5 px-3 rounded-xl">
                        {blogs[currentIndex].images.map((_, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={() => setActiveSliders(prev => ({ ...prev, [currentIndex]: imgIdx }))}
                            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                              imgIdx === activeSliders[currentIndex]
                                ? 'bg-emerald-400 scale-125'
                                : 'bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-5xl sm:text-6xl">🐾</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight line-clamp-2">
                  {blogs[currentIndex].title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                  {blogs[currentIndex].content}
                </p>
                
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-0.5 sm:space-x-1 text-amber-400">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <span className="ml-1 sm:ml-2 font-semibold text-xs sm:text-sm text-gray-700">(5.0)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 text-xs sm:text-sm font-semibold">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      {new Date(blogs[currentIndex].createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/blog/${blogs[currentIndex].slug}`}
                  className="inline-flex items-center text-emerald-600 font-bold text-base sm:text-lg hover:text-emerald-700 transition-all duration-300"
                >
                  Read More
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {blogs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'bg-emerald-600 w-6 sm:w-8' 
                    : 'w-2 sm:w-2.5 bg-emerald-300 hover:bg-emerald-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* More Blogs CTA */}
        <div className="text-center">
          <Link
            to="/blog"
            className="group relative inline-flex items-center px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 text-white font-bold text-base sm:text-xl rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-2 sm:space-x-3">
              <span>View All Blogs</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 blur-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;