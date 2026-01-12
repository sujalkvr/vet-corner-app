import { useState, useEffect } from 'react';
import { Trash2, Edit3, Star, Eye } from 'lucide-react';
import api from '../common/api';

const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data.blogs || []);
      setFeaturedBlogs(response.data.blogs?.filter(b => b.isFeatured) || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (blogId, currentStatus) => {
    try {
      await api.patch(`/blogs/${blogId}/feature`, { isFeatured: !currentStatus });
      fetchBlogs(); // Refresh list
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const deleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${blogId}`);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-emerald-100/50">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-3xl font-bold text-slate-900">{blogs.length}</p>
              <p className="text-slate-600">Total Blogs</p>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-amber-100/50">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <Star className="w-8 h-8 text-amber-500" />
            </div>
            <div className="ml-4">
              <p className="text-3xl font-bold text-slate-900">{featuredBlogs.length}</p>
              <p className="text-slate-600">Featured Blogs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 truncate max-w-xs">{blog.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{blog.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(blog._id, blog.isFeatured)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        blog.isFeatured
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      {blog.isFeatured ? '⭐ Featured' : 'Make Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogTable;
