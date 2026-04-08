import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ showBanner }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("/");
  useEffect(() => {
    const sections = ["services", "about", "store", "blog", "contact"];

    const handleScroll = () => {
      let current = "/";

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = `#${id}`;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "#services" },
    { name: "About", path: "#about" },
    { name: "Store", path: "#store" },
    { name: "Blog", path: "#blog" },
    { name: "Contact", path: "#contact" },
    { name: "Appointment", path: "/appointment" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-gray-100 transition-all duration-300"></nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl fixed left-0 right-0 z-30 transition-all duration-300 ${
            showBanner ? "top-[72px]" : "top-[44px]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block w-full px-6 py-3 rounded-2xl text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 ${
                  (
                    link.path === "/"
                      ? activeSection === "/"
                      : activeSection === link.path ||
                        location.hash === link.path ||
                        location.pathname === link.path
                  )
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-200/50"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:shadow-md"
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
