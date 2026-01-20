import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Award, Shield } from 'lucide-react';

const More = () => {
  const [showHeading, setShowHeading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showParas, setShowParas] = useState(false);

  useEffect(() => {
    const headingTimer = setTimeout(() => setShowHeading(true), 300);
    const videoTimer = setTimeout(() => setShowVideo(true), 800);
    const parasTimer = setTimeout(() => setShowParas(true), 1300);

    return () => {
      clearTimeout(headingTimer);
      clearTimeout(videoTimer);
      clearTimeout(parasTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute top-20 right-32 w-40 h-40 bg-emerald-300/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 left-24 w-48 h-48 bg-teal-300/40 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 right-1/4 w-36 h-36 bg-blue-300/40 rounded-full blur-3xl animate-float-slow" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.1); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 30px) scale(1.1); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -20px) scale(1.05); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-top {
          animation: slideInFromTop 0.8s ease-out forwards;
        }

        .animate-slide-left {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }

        .animate-slide-right {
          animation: slideInFromRight 0.8s ease-out forwards;
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-xl text-emerald-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-emerald-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </a>
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4 ${
              showHeading ? 'animate-slide-top' : 'opacity-0'
            }`}
          >
            Why Choose Us?
          </h1>
          <div
            className={`w-24 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full ${
              showHeading ? 'animate-slide-top' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          />
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Video */}
          <div
            className={`${
              showVideo ? 'animate-slide-left' : 'opacity-0'
            }`}
          >
            <div className="relative group cursor-pointer">
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-500 transform group-hover:scale-[1.02]">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/videos/clinic-video.mp4" type="video/mp4" />
                  {/* Fallback image if video doesn't load */}
                  <img
                    src="/images/pp2.jpeg"
                    alt="Clinic Video"
                    className="w-full h-full object-cover"
                  />
                </video>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">Our Clinic Tour</h3>
                    <p className="text-emerald-100 text-sm">See our state-of-the-art facilities</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-black">8+</div>
                <div className="text-sm font-bold">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right - 2 Paragraphs */}
          <div
            className={`space-y-8 ${
              showParas ? 'animate-slide-right' : 'opacity-0'
            }`}
          >
            {/* Paragraph 1 */}
            <div className="group relative p-8 lg:p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-500 border border-emerald-100/50 cursor-default transform hover:scale-[1.03]">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Award className="w-8 h-8 text-white" />
              </div>
              
              <div className="ml-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                  Expert Veterinary Care
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  Led by Dr. Krish Nayak with over 8 years of specialized experience in veterinary medicine, our team combines advanced medical knowledge with genuine compassion. We've successfully treated over 5000 pets, maintaining a 98% success rate through personalized care, state-of-the-art equipment, and continuous professional development in the latest veterinary techniques.
                </p>
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-4 right-4 w-20 h-20 border-4 border-emerald-200 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Paragraph 2 */}
            <div className="group relative p-8 lg:p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:bg-gradient-to-br hover:from-teal-50 hover:to-blue-50 transition-all duration-500 border border-teal-100/50 cursor-default transform hover:scale-[1.03]">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Shield className="w-8 h-8 text-white" />
              </div>
              
              <div className="ml-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors duration-300">
                  Comprehensive Pet Healthcare
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  From routine wellness exams and vaccinations to advanced surgical procedures and emergency care, we offer complete healthcare solutions for your beloved pets. Our preventive care programs, 24/7 emergency services, and modern diagnostic facilities ensure your pet receives the best possible treatment at every stage of their life. Your pet's health and happiness are our top priorities.
                </p>
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-4 right-4 w-20 h-20 border-4 border-teal-200 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-emerald-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Give Your Pet the Best Care?
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              Book an appointment today and experience the difference.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Heart className="w-5 h-5 mr-2" />
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;