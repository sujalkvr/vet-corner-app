// src/components/Services.jsx - SINGLE ROW BUTTONS FIXED
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [openModal, setOpenModal] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Consultation',
      subtitle: 'Expert veterinary consultations for all pet health concerns',
      brief: 'Comprehensive health assessments and diagnostics. Personalized treatment recommendations. Routine checkups and preventive care.',
      bgColor: 'from-emerald-400/80 to-teal-500/80',
      image: 'images/services1.jpeg',
      details: 'Our expert veterinarians provide thorough consultations to diagnose and treat your pet\'s health issues. From routine checkups to complex medical conditions, we create personalized treatment plans tailored to your pet\'s specific needs and lifestyle.',
      features: ['Routine health checkups', 'Diagnostic examinations', 'Treatment planning', 'Health counseling']
    },
    {
        id: 2,
        title: 'Vaccination',
        subtitle: 'Complete vaccination schedules for optimal protection',
        brief: 'Full puppy/kitten vaccination series available. Adult booster shots and rabies vaccines. Customized schedules based on lifestyle.',
        bgColor: 'from-blue-400/80 to-emerald-500/80',
        image: 'images/services2.jpg',
        details: 'We follow the latest veterinary guidelines with complete vaccination schedules customized for puppies, kittens, and adult pets. Our vaccination programs protect against deadly diseases with regular boosters to maintain lifelong immunity.',
        features: ['Puppy/Kitten series', 'Adult boosters', 'Rabies vaccination', 'Lifestyle vaccines']
    },
    {
        id: 3,
        title: 'Nutrition',
        subtitle: 'Personalized nutrition plans for pet wellness',
        brief: 'Custom diet plans for all life stages. Weight management programs. Special medical diets and supplements.',
        bgColor: 'from-purple-400/80 to-pink-500/80',
        image: 'images/services3.jpg',
      details: 'Nutrition consultations with specialized diets for all life stages, medical conditions, and weight management. We recommend premium foods and create feeding plans based on your pet\'s age, breed, activity level, and health requirements.',
      features: ['Dietary assessments', 'Weight management', 'Special needs diets', 'Supplement guidance']
    }
  ];

  const currentService = services.find(s => s.id === openModal);

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading + Cards - UNCHANGED */}
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 drop-shadow-xl mb-6 leading-tight">
            Our Core Services
          </h2>
          <p className="text-xl sm:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed">
            Professional veterinary care tailored for your pet's unique needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-emerald-500/30 hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 cursor-pointer group"
              onClick={() => setOpenModal(service.id)}
            >
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${service.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className={`absolute inset-0 ${service.bgColor} opacity-20 group-hover:opacity-30 transition-opacity duration-700 backdrop-blur-sm`} />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-white z-10">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black drop-shadow-2xl mb-4 leading-tight">
                    {service.title}
                  </h3>
                  <div className="subtitle text-lg md:text-xl font-semibold drop-shadow-xl mb-6 opacity-95">
                    {service.subtitle}
                  </div>
                </div>
                <div className="brief text-sm md:text-base text-white/90 font-normal leading-relaxed max-w-md mx-auto drop-shadow-lg mb-8 px-2 text-center">
                  {service.brief.split('. ').map((sentence, idx) => (
                    <span key={idx} className="block mb-1 last:mb-0">{sentence.trim()}.</span>
                  ))}
                </div>
                <div className="text-center">
                  <button className="group/btn relative px-10 py-4 bg-white/30 backdrop-blur-xl border-2 border-white/60 text-white font-bold text-sm md:text-base rounded-2xl shadow-xl hover:bg-white/60 hover:border-white/80 hover:shadow-2xl hover:scale-105 transition-all duration-400">
                    <span className="flex items-center justify-center space-x-2">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services" className="group relative inline-flex items-center px-16 py-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-500 overflow-hidden border border-white/20 backdrop-blur-sm">
            <span className="relative z-10 flex items-center space-x-3">
              Explore All Services
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>
      </div>

      {/* PERFECT SINGLE-ROW MODAL */}
      {openModal && currentService && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 md:p-8"
          onClick={() => setOpenModal(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border-4 border-emerald-200/20 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* HEADER + CLOSE */}
            <div className="p-8 pt-4 pb-6 border-b border-gray-100 flex items-start justify-between">
              <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-xl">
                {currentService.title}
              </h3>
              <button
                onClick={() => setOpenModal(null)}
                className="w-12 h-12 ml-4 bg-emerald-500/90 hover:bg-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-emerald-400/50 hover:scale-110 transition-all duration-200 flex items-center justify-center text-xl font-bold border-2 border-white/30"
              >
                ✕
              </button>
            </div>

            {/* CONTENT - PERFECTLY FILLED */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              {/* Details */}
              <div className="mb-8">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light mb-8">
                  {currentService.details}
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-3">
                  {currentService.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-4 bg-emerald-50/80 backdrop-blur-sm rounded-xl border border-emerald-200/50 hover:bg-emerald-100 hover:shadow-md transition-all duration-200">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm flex-shrink-0" />
                      <span className="font-medium text-gray-800 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SINGLE ROW BUTTONS - BOTTOM */}
            <div className="px-8 pb-8 pt-6 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-b-3xl border-t border-gray-100 flex gap-4">
              <Link
                to="/appointment"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300 text-center text-lg flex items-center justify-center space-x-2 group"
              >
                <span>Book {currentService.title}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                onClick={() => setOpenModal(null)}
                className="px-8 py-4 border-2 border-emerald-300/70 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 hover:shadow-lg hover:border-emerald-400 hover:scale-[1.02] transition-all duration-300 text-lg flex items-center justify-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
