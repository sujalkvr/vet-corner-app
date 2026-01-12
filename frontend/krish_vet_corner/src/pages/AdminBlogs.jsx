import { Plus, Search, Filter } from 'lucide-react';
import BlogTable from '../components/Admin/BlogTable';
import { Link } from 'react-router-dom';

const AdminBlogs = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Blog Management</h1>
          <p className="text-xl text-slate-600">Manage your featured articles and blog posts</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300 flex items-center space-x-3 w-full sm:w-auto justify-center"
        >
          <Plus className="w-6 h-6" />
          <span>New Blog Post</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200/50 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search blogs by title..."
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/50 outline-none transition-all duration-300"
            />
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-300 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/50">
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      {/* Blog Table */}
      <BlogTable />
    </div>
  );
};

export default AdminBlogs;
