import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ showBanner }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("/");
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

      // MOBILE NAVBAR SHOW/HIDE

      if (window.innerWidth < 1024) {
        // CLOSE MOBILE MENU ON SCROLL
        setMobileOpen(false);

        if (window.scrollY > lastScrollY) {
          setShowNavbar(false); // scrolling down
        } else {
          setShowNavbar(true); // scrolling up
        }

        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Services", path: "/#services" },
    { name: "Our Expertise", path: "#expertise" },
    { name: "Blog", path: "/#blog" },

    { name: "Store", path: "/#store" },

    { name: "Contact", path: "/#contact" },
    { name: "Appointment", path: "/appointment" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`bg-white/80 backdrop-blur-xl shadow-xl sticky z-50 border-b border-gray-100 transition-all duration-300 ${
          showBanner ? "top-[28px]" : "top-0"
        } ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <img
                src="/images/logo.png"
                alt="Krish Vet Corner"
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300 rounded-lg shadow-md hover:shadow-lg"
              />
              {/* <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Krish Vet Corner
              </span> */}
              <img
                src="/images/logo-text.png"
                alt="Krish Vet Corner"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) =>
                link.name === "Our Expertise" ? (
                  <button
                    key={link.name}
                    onClick={() => {
                      setMobileOpen(false);
                      window.dispatchEvent(new Event("openExpertise"));
                    }}
                    className="group relative px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:shadow-md transition-all duration-300"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`group relative px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                      (
                        link.path === "/"
                          ? activeSection === "/"
                          : activeSection === link.path ||
                            location.hash === link.path ||
                            location.pathname === link.path
                      )
                        ? "text-blue-600 font-semibold shadow-md shadow-blue-100"
                        : "text-gray-700 hover:text-blue-600 hover:shadow-md hover:shadow-blue-100/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ),
              )}
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              <span
                className={`text-xl font-bold transition-transform duration-200 ${mobileOpen ? "rotate-90 scale-110" : ""}`}
              >
                {mobileOpen ? "✕" : "≡"}
              </span>
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}

      <div
        className={`lg:hidden bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl fixed right-3 w-52 z-30 transition-all duration-300 ease-out ${
          showBanner ? "top-[92px]" : "top-[72px]"
        } ${
          mobileOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-5 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-start px-4 py-4 space-y-3">
          {navLinks.map((link) =>
            link.name === "Our Expertise" ? (
              <button
                key={link.name}
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new Event("openExpertise"));
                }}
                className="group relative px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:shadow-md transition-all duration-300"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`group relative px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                  (
                    link.path === "/"
                      ? activeSection === "/"
                      : activeSection === link.path ||
                        location.hash === link.path ||
                        location.pathname === link.path
                  )
                    ? "text-blue-600 font-semibold shadow-md shadow-blue-100"
                    : "text-gray-700 hover:text-blue-600 hover:shadow-md hover:shadow-blue-100/50"
                }`}
              >
                {link.name}
              </Link>
            ),
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
