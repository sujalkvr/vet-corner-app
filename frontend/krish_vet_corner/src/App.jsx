// src/App.jsx - COMPLETE SINGLE PAGE
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import './index.css';
import { Contact } from 'lucide-react';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer'

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
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <ContactForm/>
              <Footer/>
              
              {/* Add more sections here */}
            </>
          } />
          <Route path="/services" element={<Services />} />
          <Route path="/appointment" element={<div>Appointment Page</div>} />
          {/* Add other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
