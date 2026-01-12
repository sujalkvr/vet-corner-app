import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Blogs', icon: FileText, path: '/admin/blogs' },
    { name: 'Appointments', icon: Calendar, path: '/admin/appointments' }
  ];

  return (
    <div className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 fixed lg:relative h-full z-50 ${isOpen ? 'w-64' : 'w-0 lg:w-20'} overflow-hidden shadow-2xl`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className={`text-xl font-bold transition-all duration-300 ${isOpen ? 'block' : 'hidden lg:block'}`}>
            Admin Panel
          </h1>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
              location.pathname === item.path
                ? 'bg-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/30 text-emerald-300'
                : 'hover:bg-slate-700/50 hover:text-emerald-400'
            }`}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            <span className={`${isOpen ? 'block' : 'hidden lg:block'} font-medium`}>
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-0 right-0 p-4">
        <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-700/50 hover:text-rose-400 transition-all duration-300 group">
          <LogOut className="w-6 h-6" />
          <span className={`${isOpen ? 'block' : 'hidden lg:block'} font-medium`}>
            Logout
          </span>
        </button>
      </div>

      {/* Mobile Collapse Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden absolute -right-12 top-20 p-2 bg-slate-800 rounded-r-lg border border-slate-600 hover:bg-emerald-500"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
