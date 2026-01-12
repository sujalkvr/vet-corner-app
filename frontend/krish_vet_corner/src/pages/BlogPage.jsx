import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from '../components/Blog/BlogCard';
import api from '../components/common/api';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm]);

  const fetchBlogs = async () => {
    try {
      const params = { page: currentPage, limit: 9 };
      if (searchTerm) params.search = searchTerm;
      
      const response = await api.get('/blogs', { params });
      setBlogs(response.data.blogs || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 bg-clip-text text-transparent mb-6">
            🐾 Vet Corner Blog
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Expert veterinary advice, pet care tips, vaccination schedules, and latest updates from Krish Vet Corner Warsaw
          </p>
        </div>

        {/* Search */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1">
              <Search className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles about vaccines, grooming, pet care..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 border-2 border-slate-200 rounded-3xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/50 outline-none transition-all duration-300 text-lg"
              />
            </div>
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300 whitespace-nowrap"
            >
              Search Blogs
            </button>
          </form>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border border-slate-200"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : totalPages - 4 + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                        currentPage === page
                          ? 'bg-emerald-500 text-white shadow-emerald-500/50'
                          : 'bg-white hover:shadow-xl border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border border-slate-200"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-32">
            <FileText className="w-32 h-32 text-slate-300 mx-auto mb-8 opacity-75" />
            <h3 className="text-3xl font-bold text-slate-500 mb-4">No blogs found</h3>
            <p className="text-xl text-slate-400 mb-8">Try adjusting your search or check back later</p>
            <button
              onClick={() => {setSearchTerm(''); setCurrentPage(1);}}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-12 py-6 rounded-3xl shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300"
            >
              View All Blogs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
