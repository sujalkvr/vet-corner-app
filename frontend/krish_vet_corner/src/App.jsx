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
              href="/#contact"
              className="fixed bottom-6 right-6 z-[9999] group"
            >
              <div className="relative">
                {/* Glow */}
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 animate-ping"></span>

                {/* Button */}
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/50">
                  {/* Clean Chat Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.2-3.2A7.6 7.6 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
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
