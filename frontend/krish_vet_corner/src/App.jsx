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

const ScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
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

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
              <ScrollToSection />
              <Routes>
                {/* HOME - COMPLETE SINGLE PAGE */}
                <Route
                  path="/"
                  element={
                    <>
                      <NotificationBanner
                        show={showBanner}
                        setShow={setShowBanner}
                      />
                      <Navbar showBanner={showBanner} />
                      <Hero />
                      <About />
                      <Services />
                      <Team />
                      {/* <Reviews /> */}
                      <BlogSection />
                      <Store />
                      <Faq />
                      <ContactForm />
                      <Footer />
                    </>
                  }
                />

                {/* INDIVIDUAL PAGES (with Navbar & Footer) */}
                <Route
                  path="/services"
                  element={
                    <>
                      <NotificationBanner
                        show={showBanner}
                        setShow={setShowBanner}
                      />
                      <Navbar showBanner={showBanner} />
                      <Services />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/appointment"
                  element={
                    <>
                      <NotificationBanner
                        show={showBanner}
                        setShow={setShowBanner}
                      />
                      <Navbar showBanner={showBanner} />
                      <Appointment />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/more"
                  element={
                    <>
                      <NotificationBanner
                        show={showBanner}
                        setShow={setShowBanner}
                      />
                      <Navbar showBanner={showBanner} />
                      <More />
                      <Footer />
                    </>
                  }
                />

                {/* ALL BLOGS PAGE */}
                <Route path="/blog" element={<AllBlogs />} />

                {/* BLOG DETAIL PAGE */}
                <Route path="/blog/:slug" element={<BlogDetail />} />

                {/* STORE & PAYMENT ROUTES */}
                <Route
                  path="/store/:category"
                  element={<ProductsByCategory />}
                />
                <Route path="/payment" element={<Payment />} />

                {/* ADMIN ROUTES (No Navbar/Footer) */}
                <Route path="/admin" element={<SignIn />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/store/auth" element={<AdminStoreAuth />} />
                <Route path="/admin/store" element={<AdminStore />} />
                <Route path="/admin/team" element={<AdminTeam />} />

                {/* 404 Fallback */}
                <Route
                  path="*"
                  element={
                    <>
                      <NotificationBanner
                        show={showBanner}
                        setShow={setShowBanner}
                      />
                      <Navbar showBanner={showBanner} />
                      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
                        <div className="text-center p-12 max-w-md mx-auto">
                          <h1 className="text-6xl font-black text-gray-900 mb-6">
                            404
                          </h1>
                          <p className="text-2xl text-gray-600 mb-8">
                            Page not found
                          </p>
                          <a
                            href="/"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
                          >
                            ← Back to Home
                          </a>
                        </div>
                      </div>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </div>
          </>
        </Router>
      )}
    </>
  );
}

export default App;
