import { useState } from 'react';
import { ShoppingBag, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const Store = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    {
      id: 'pet-care',
      name: 'Book Services',
      description: 'Your pet deserves the best care. Easily book a consultation at your ease.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
      icon: '🐾',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/store/pet-care'
    },
    {
      id: 'courses',
      name: 'For Pet Parents',
      description: 'Access trusted, Vet-Approved pet care guides and products',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
      icon: '📚',
      gradient: 'from-purple-500 to-pink-500',
      path: '/store/courses'
    },
    {
      id: 'others',
      name: 'For Students',
      description: 'Strengthen your clinical skills with structred learning resources',
      image: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=800&q=80',
      icon: '✨',
      gradient: 'from-orange-500 to-red-500',
      path: '/store/others'
    }
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="store" className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 sm:mb-6 shadow-2xl animate-bounce">
            <ShoppingBag className="text-white" size={32} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent px-4">
             Store
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Discover premium products and courses designed for your pet's health and happiness
          </p>
        </div>

        {/* Desktop View - 3 Cards Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-12 sm:mb-16">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image with Overlay */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                
                {/* Icon Badge */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  {category.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {category.description}
                </p>

                {/* View Button */}
                <a
                  href={category.path}
                  className={`group/btn relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r ${category.gradient} text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View Products
                    <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-2" size={20} />
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Mobile/Tablet View - Carousel */}
        <div className="md:hidden relative mb-12">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-purple-500 hover:text-white text-purple-600"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-purple-500 hover:text-white text-purple-600"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Single Card Display */}
          <div className="px-12 sm:px-16">
            <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-all duration-500">
              {/* Image with Overlay */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={categories[currentIndex].image}
                  alt={categories[currentIndex].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${categories[currentIndex].gradient} opacity-60 transition-opacity duration-300`} />
                
                {/* Icon Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
                  {categories[currentIndex].icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {categories[currentIndex].name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 line-clamp-2">
                  {categories[currentIndex].description}
                </p>

                {/* View Button */}
                <a
                  href={categories[currentIndex].path}
                  className={`group/btn relative inline-flex items-center justify-center w-full px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-r ${categories[currentIndex].gradient} text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl text-sm sm:text-base`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View Products
                    <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-2" size={18} />
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {categories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'bg-purple-600 w-6 sm:w-8' 
                    : 'w-2 sm:w-2.5 bg-purple-300 hover:bg-purple-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl shadow-lg">
            <Sparkles className="text-purple-600 flex-shrink-0" size={20} />
            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
              Need help choosing? <a href="/appointment" className="text-purple-600 hover:text-purple-800 underline">Book a consultation</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Store;