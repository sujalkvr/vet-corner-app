import { Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="group bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-slate-200/50 hover:border-emerald-200/50">
      {/* Image */}
      <div className="h-64 overflow-hidden relative group-hover:scale-105 transition-transform duration-700">
        <img
          src={blog.featuredImages?.[0] || '/api/placeholder/500/300'}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        {blog.isFeatured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center text-emerald-600 mb-4 space-x-2">
          <span className="text-2xl font-bold">{blog.rating || 5.0}</span>
          <div className="flex text-xl">{'★'.repeat(5)}</div>
          <Clock className="w-5 h-5" />
          <span>{blog.readTime || '3 min'}</span>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
          {blog.content?.substring(0, 120)}...
        </p>

        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold group-hover:translate-x-2 transition-all duration-300"
        >
          <span>Read More</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
