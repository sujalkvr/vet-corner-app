// src/App.jsx - FULLY CORRECTED
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import Appointment from './components/Appointment';
import Footer from './components/Footer';
import './index.css';
import About from './components/About';
import Reviews from './components/Reviews';
import BlogSection from './components/Blog/BlogSection';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminBlogs from './pages/AdminBlogs';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import Login from './components/Admin/Login';
import ProtectedRoute from './components/common/ProtectedRoute';     // ✅ CORRECT

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

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <ScrollToSection />
      <Routes>
        {/* 🏠 PUBLIC ROUTES */}
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Reviews />
            <BlogSection />
            <ContactForm />
            <Footer />
          </>
        } />
        
        <Route path="/services" element={
          <>
            <Navbar />
            <Services />
            <Footer />
          </>
        } />
        
        <Route path="/appointment" element={
          <>
            <Navbar />
            <Appointment />
            <Footer />
          </>
        } />

        {/* 📝 BLOG ROUTES */}
        <Route path="/blog" element={
          <>
            <Navbar />
            <BlogPage />
          </>
        } />
        <Route path="/blog/:slug" element={
          <>
            <Navbar />
            <BlogPostPage />
          </>
        } />

        {/* 🔐 ADMIN LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* 🔐 PROTECTED ADMIN ROUTES */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />

        {/* 404 Fallback */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
            <div className="text-center p-12 max-w-md mx-auto">
              <h1 className="text-6xl font-black text-gray-900 mb-6">404</h1>
              <p className="text-2xl text-gray-600 mb-8">Page not found</p>
              <a href="/" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300">
                ← Back to Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>                    // ✅ ROUTER FIRST
      <AuthProvider>            // ✅ THEN AuthProvider  
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
