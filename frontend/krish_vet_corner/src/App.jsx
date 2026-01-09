// src/App.jsx - FULLY UPDATED
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import Appointment from './components/Appointment'; // ADD THIS
import Footer from './components/Footer';
import './index.css';
import About from './components/About';
import Reviews from './components/Reviews';

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
        <Navbar />
        <ScrollToSection />
        <Routes>
          {/* HOME - COMPLETE SINGLE PAGE */}
          <Route path="/" element={
            <>
              <Hero />
              <About/>
              <Services />
              <Reviews/>
              <ContactForm />
              <Footer />
            </>
          } />
          
          {/* INDIVIDUAL PAGES */}
          <Route path="/services" element={<Services />} />
          <Route path="/appointment" element={<Appointment />} />
          
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
    </Router>
  );
}

export default App;
