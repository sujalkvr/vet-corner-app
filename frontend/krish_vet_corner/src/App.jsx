// src/App.jsx - UPDATED WITH LOADING SCREEN
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Load from "./components/Load";
import Navbar from "./components/Navbar";
import NotificationBanner from "./components/NotificationBanner";
import Hero from "./components/Hero";
import Services from "./components/Services";
import ContactForm from "./components/ContactForm";
import Appointment from "./components/Appointment";
import Footer from "./components/Footer";
import About from "./components/About";
// import Reviews from './components/Reviews';
import BlogSection from "./components/BlogSection";
import BlogDetail from "./components/BlogDetail";
import AllBlogs from "./components/AllBlogs";
import SignIn from "./components/Admin/SignIn";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminStore from "./components/Admin/AdminStore";
import AdminStoreAuth from "./components/Admin/AdminStoreAuth";
import AdminTeam from "./components/Admin/AdminTeam";
import Store from "./components/Store";
import ProductsByCategory from "./components/ProductsByCategory";
import Payment from "./components/Payment";
import Animation from "./components/Animation";
import Faq from "./components/Faq";
import More from "./components/More";
import Team from "./components/Team";
import "./index.css";
import { MessageCircle } from "lucide-react";

const ScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    // Always go to top on route change
    window.scrollTo(0, 0);

    // Only handle hash scrolling on home page
    if (location.pathname === "/" && location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {isLoading ? (
        <Load onLoadComplete={() => setIsLoading(false)} />
      ) : (
        <Router>
          <>
            <NotificationBanner show={showBanner} setShow={setShowBanner} />
            <Navbar showBanner={showBanner} />

            <div
              className={`min-h-screen bg-gradient-to-br from-emerald-50 to-white ${
                showBanner ? "pt-[28px]" : "pt-0"
              }`}
            >
              <ScrollToSection />

              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <About />
                      <Services />
                      <Team />
                      <BlogSection />
                      <Store />
                      <Faq />
                      <ContactForm />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/services"
                  element={
                    <>
                      <Services />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/appointment"
                  element={
                    <>
                      <Appointment />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/more"
                  element={
                    <>
                      <More />
                      <Footer />
                    </>
                  }
                />

                <Route path="/blog" element={<AllBlogs />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />

                <Route
                  path="/store/:category"
                  element={<ProductsByCategory />}
                />
                <Route path="/payment" element={<Payment />} />

                <Route path="/admin" element={<SignIn />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/store/auth" element={<AdminStoreAuth />} />
                <Route path="/admin/store" element={<AdminStore />} />
                <Route path="/admin/team" element={<AdminTeam />} />

                <Route
                  path="*"
                  element={
                    <>
                      <div className="min-h-screen flex items-center justify-center">
                        404
                      </div>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </div>
            <a
              href="https://wa.me/918886116993"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-[9999] group"
            >
              <div className="relative">
                {/* Glow Pulse */}
                <span className="absolute inset-0 rounded-full bg-green-400 opacity-70 animate-ping"></span>

                {/* Main Button */}
                <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-6 h-6"
                    fill="white"
                  >
                    <path d="M19.11 17.64c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.31.2-.58.07-.27-.13-1.14-.42-2.17-1.34-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.46.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.83-2.01-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.85.13.18 1.95 2.97 4.73 4.16.66.28 1.18.45 1.58.57.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.31z" />
                    <path d="M16 3C9.37 3 4 8.37 4 15c0 2.64.86 5.07 2.33 7.04L5 29l7.14-1.87A12.93 12.93 0 0016 27c6.63 0 12-5.37 12-12S22.63 3 16 3zm0 22c-1.87 0-3.68-.5-5.27-1.44l-.38-.22-4.23 1.11 1.13-4.12-.25-.39A9.96 9.96 0 016 15c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10z" />
                  </svg>
                </div>
              </div>
            </a>
          </>
        </Router>
      )}
    </>
  );
}

export default App;
