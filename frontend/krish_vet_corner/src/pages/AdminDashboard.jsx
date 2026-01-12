import { LayoutDashboard, FileText, Calendar, Activity, Users } from 'lucide-react';
import BlogTable from '../components/Admin/BlogTable';

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Blogs', value: '12', change: '+3', icon: FileText, color: 'emerald' },
    { name: 'Featured Blogs', value: '3', change: '0', icon: Activity, color: 'amber' },
    { name: 'Appointments', value: '27', change: '+12%', icon: Calendar, color: 'blue' },
    { name: 'Patients', value: '156', change: '+8%', icon: Users, color: 'purple' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 text-white shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Welcome Back, Dr. Krish! 👋
          </h1>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Here's what's happening with your clinic today. Manage blogs and appointments effortlessly.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/admin/blogs" className="bg-white/20 backdrop-blur-xl hover:bg-white/30 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105">
              Manage Blogs
            </a>
            <a href="/admin/appointments" className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              View Appointments
            </a>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-200/50">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold text-slate-900 ${stat.color === 'emerald' ? 'text-emerald-600' : ''}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-600 uppercase tracking-wide font-semibold">{stat.name}</p>
                </div>
              </div>
              <p className="text-sm text-emerald-600 font-semibold mt-2">{stat.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Blogs */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Recent Blogs</h2>
              <a href="/admin/blogs" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-2">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            <BlogTable />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 sticky top-8 h-fit">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <a
                href="/admin/blogs/new"
                className="w-full block p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-[1.02] text-center font-semibold"
              >
                + New Blog Post
              </a>
              <button className="w-full p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:shadow-blue-500/50 hover:scale-[1.02] font-semibold">
                📅 Today's Schedule
              </button>
              <button className="w-full p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] font-semibold">
                🐾 New Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
