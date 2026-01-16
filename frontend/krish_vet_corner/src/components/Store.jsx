import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

const Store = () => {
  const categories = [
    {
      id: 'pet-care',
      name: 'Pet Care Products',
      description: 'Premium quality products for your beloved pets',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
      icon: '🐾',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/store/pet-care'
    },
    {
      id: 'courses',
      name: 'Pet Care Courses',
      description: 'Learn professional pet care techniques and training',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
      icon: '📚',
      gradient: 'from-purple-500 to-pink-500',
      path: '/store/courses'
    },
    {
      id: 'others',
      name: 'Other Products',
      description: 'Explore our special collection of unique items',
      image: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=800&q=80',
      icon: '✨',
      gradient: 'from-orange-500 to-red-500',
      path: '/store/others'
    }
  ];

  return (
    <section id="store" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl animate-bounce">
            <ShoppingBag className="text-white" size={40} />
          </div>
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Store
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover premium products and courses designed for your pet's health and happiness
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <Link
                  to={category.path}
                  className={`group/btn relative inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r ${category.gradient} text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View Products
                    <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-2" size={20} />
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl shadow-lg">
            <Sparkles className="text-purple-600" size={24} />
            <p className="text-lg font-semibold text-gray-800">
              Need help choosing? <Link to="/appointment" className="text-purple-600 hover:text-purple-800 underline">Book a consultation</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Store;