// src/App.jsx - ADD NOTIFICATION BANNER
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import NotificationBanner from './components/NotificationBanner'; // ✅ ADD THIS
import Hero from './components/Hero';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import Appointment from './components/Appointment';
import Footer from './components/Footer';
import About from './components/About';
import Reviews from './components/Reviews';
import BlogSection from './components/BlogSection';
import BlogDetail from './components/BlogDetail';
import AllBlogs from './components/AllBlogs';
import SignIn from './components/Admin/SignIn';
import AdminDashboard from './components/Admin/AdminDashboard';
import './index.css';

const ScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
        <ScrollToSection />
        <Routes>
          {/* HOME - COMPLETE SINGLE PAGE */}
          <Route path="/" element={
            <>
              <Navbar />
              <NotificationBanner /> {/* ✅ ADD THIS */}
              <Hero />
              <About />
              <Services />
              <Reviews />
              <BlogSection />
              <ContactForm />
              <Footer />
            </>
          } />
          
          {/* INDIVIDUAL PAGES (with Navbar & Footer) */}
          <Route path="/services" element={
            <>
              <Navbar />
              <NotificationBanner /> {/* ✅ ADD THIS */}
              <Services />
              <Footer />
            </>
          } />
          
          <Route path="/appointment" element={
            <>
              <Navbar />
              <NotificationBanner /> {/* ✅ ADD THIS */}
              <Appointment />
              <Footer />
            </>
          } />

          {/* ALL BLOGS PAGE */}
          <Route path="/blog" element={<AllBlogs />} />

          {/* BLOG DETAIL PAGE */}
          <Route path="/blog/:slug" element={<BlogDetail />} />
          
          {/* ADMIN ROUTES (No Navbar/Footer) */}
          <Route path="/admin" element={<SignIn />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* 404 Fallback */}
          <Route path="*" element={
            <>
              <Navbar />
              <NotificationBanner /> {/* ✅ ADD THIS */}
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
                <div className="text-center p-12 max-w-md mx-auto">
                  <h1 className="text-6xl font-black text-gray-900 mb-6">404</h1>
                  <p className="text-2xl text-gray-600 mb-8">Page not found</p>
                  <a href="/" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300">
                    ← Back to Home
                  </a>
                </div>
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;