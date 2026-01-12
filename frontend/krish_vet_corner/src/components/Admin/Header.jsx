import { useState } from 'react';
import { Bell, Search, User, Menu, Settings } from 'lucide-react';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left: Menu + Search */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search blogs, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2 w-72 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>

            <div className="flex items-center space-x-3 p-2 hover:bg-slate-100 rounded-xl transition-all duration-300 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden lg:block">
                <p className="font-semibold text-slate-900">Dr. Krish</p>
                <p className="text-sm text-slate-500">Admin</p>
              </div>
              <Settings className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
