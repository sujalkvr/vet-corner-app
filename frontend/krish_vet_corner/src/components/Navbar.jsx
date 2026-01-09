import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'Appointment', path: '/appointment' },
    { name: 'Admin', path: '/admin' }
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                <span className="text-xl font-bold text-white">K</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Krish Vet Corner
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group relative px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === link.path 
                      ? 'text-blue-600 font-semibold shadow-md shadow-blue-100' 
                      : 'text-gray-700 hover:text-blue-600 hover:shadow-md hover:shadow-blue-100/50'
                  }`}
                >
                  {link.name}
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl -z-10 scale-0 group-hover:scale-100 origin-center transition-all duration-300 blur-sm" />
                </Link>
              ))}
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              <span className={`text-xl font-bold transition-transform duration-200 ${mobileOpen ? 'rotate-90 scale-110' : ''}`}>
                {mobileOpen ? '✕' : '≡'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block w-full px-6 py-3 rounded-2xl text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 ${
                  location.pathname === link.path
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-200/50'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:shadow-md'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
