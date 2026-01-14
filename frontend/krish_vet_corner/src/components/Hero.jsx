// src/components/Hero.jsx - REPLACED VERSION
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    '/images/hero11.jpg',
    '/images/hero12.jpg', 
    '/images/hero13.jpg',
    '/images/hero14.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/80">
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.06),transparent_50%)]" />
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* LEFT: Images */}
        <div className="flex justify-center lg:justify-start order-2 lg:order-1">
          <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-200/50 ring-4 ring-emerald-100/50 mx-auto lg:mx-0">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Vet Hero ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                  idx === currentImage 
                    ? 'scale-100 opacity-100 shadow-2xl z-20' 
                    : 'scale-110 opacity-0 blur-sm z-10'
                }`}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            ))}
            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 bg-white/90 backdrop-blur-sm py-2 px-4 rounded-2xl shadow-lg">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                    idx === currentImage 
                      ? 'bg-emerald-400 scale-125 shadow-md' 
                      : 'bg-emerald-200 hover:bg-emerald-300 hover:scale-110'
                  }`}
                  onClick={() => setCurrentImage(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="text-center lg:text-left order-1 lg:order-2 flex flex-col items-center lg:items-start">
          
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-100/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-fit">
            🩺 Trusted Veterinary Care Since 2020
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl max-w-2xl">
            Your Pet's Health, <span className="block text-emerald-600 drop-shadow-2xl">Our Priority</span>
          </h1>
          
          {/* Subtext */}
          <p className="text-lg sm:text-xl lg:text-2xl text-emerald-800/90 font-light leading-relaxed mb-12 max-w-lg drop-shadow-sm">
            Expert veterinary care with love & compassion. From routine checkups to emergency treatment.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-fit">
            <Link
              to="/appointment"
              className="group relative px-10 py-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden flex-1 sm:flex-none justify-center"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                Book Appointment Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/services"
              className="px-10 py-5 border-2 border-emerald-300/50 bg-white/70 backdrop-blur-sm text-emerald-700 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:bg-emerald-50 hover:scale-[1.02] transition-all duration-300 flex-1 sm:flex-none justify-center"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
        <div className="w-6 h-12 border-2 border-emerald-300/50 rounded-full flex justify-center items-start pt-3 px-1">
          <div className="w-1.5 h-4 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
