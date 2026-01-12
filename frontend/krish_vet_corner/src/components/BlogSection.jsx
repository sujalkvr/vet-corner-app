// src/components/BlogSection.jsx
import { useState } from 'react';
import { ChevronRight, ArrowRight, Star } from 'lucide-react';
import React from 'react';

const BlogSection = () => {
  const [activeSliders, setActiveSliders] = useState({ 0: 0, 1: 0, 2: 0 });

  const blogs = [
    {
      id: 1,
      title: 'Puppy Vaccination Guide',
      slug: 'puppy-vaccination-guide',
      images: ['/images/blog1-1.jpg', '/images/blog1-2.jpg', '/images/blog1-3.jpg']
    },
    {
      id: 2,
      title: 'Cat Dental Health Tips',
      slug: 'cat-dental-health',
      images: ['/images/blog2-1.jpg', '/images/blog2-2.jpg', '/images/blog2-3.jpg']
    },
    {
      id: 3,
      title: 'Dog Nutrition Essentials',
      slug: 'dog-nutrition',
      images: ['/images/blog3-1.jpg', '/images/blog3-2.jpg', '/images/blog3-3.jpg']
    }
  ];

  // Auto-slide for each card
  React.useEffect(() => {
    const intervals = blogs.map((_, index) => {
      return setInterval(() => {
        setActiveSliders(prev => ({
          ...prev,
          [index]: (prev[index] + 1) % 3
        }));
      }, 3000);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            Pet Care Blog
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
            Latest articles from Dr. Krish Nayak
          </p>
        </div>

        {/* 3 Blog Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {blogs.map((blog, index) => (
            <div key={blog.id} className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-emerald-400/40 overflow-hidden border border-emerald-200/50 hover:-translate-y-4 transition-all duration-700 hover:scale-[1.02]">
              
              {/* Image Slider */}
              <div className="relative h-80 overflow-hidden rounded-t-3xl">
                {blog.images.map((img, imgIdx) => (
                  <img
                    key={imgIdx}
                    src={img}
                    alt={blog.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                      imgIdx === activeSliders[index]
                        ? 'opacity-100 scale-100 shadow-2xl'
                        : 'opacity-0 scale-110 blur-sm'
                    }`}
                  />
                ))}
                
                {/* Slider Dots */}
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

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors duration-500">
                  {blog.title}
                </h3>
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-2 font-semibold text-sm text-gray-700">(5.0)</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
                    2 min read
                  </span>
                </div>

                <a
                  href={`/blog/${blog.slug}`}
                  className="group inline-flex items-center text-emerald-600 font-bold text-lg hover:text-emerald-700 transition-all duration-300 group-hover:translate-x-2"
                >
                  Read More
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* More Blogs CTA */}
        <div className="text-center">
          <a
            href="/blog"
            className="group relative inline-flex items-center px-12 py-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-3">
              View All Blogs
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 blur-sm" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;