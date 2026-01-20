import { useState } from 'react';
import { Award, Heart, GraduationCap, Stethoscope } from 'lucide-react';

const About = () => {
  const [imageHover, setImageHover] = useState(false);

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50/50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Animated Floating Circles */}
      <div className="absolute top-20 right-32 w-40 h-40 bg-emerald-300/60 rounded-full blur-xl animate-float" />
<div className="absolute top-40 left-24 w-32 h-32 bg-teal-300/65 rounded-full blur-xl animate-float-delayed" />
<div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-300/60 rounded-full blur-xl animate-float-slow" />
<div className="absolute bottom-64 left-40 w-36 h-36 bg-purple-300/65 rounded-full blur-xl animate-float" />
<div className="absolute top-1/2 right-1/4 w-28 h-28 bg-cyan-300/70 rounded-full blur-xl animate-float-delayed" />
<div className="absolute top-1/3 left-1/3 w-44 h-44 bg-emerald-300/55 rounded-full blur-2xl animate-float-slow" />
      <style>{`
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -30px) scale(1.1); }
    50% { transform: translate(-15px, -50px) scale(0.9); }
    75% { transform: translate(-25px, -20px) scale(1.05); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(-25px, 30px) scale(0.95); }
    50% { transform: translate(20px, 45px) scale(1.1); }
    75% { transform: translate(15px, 15px) scale(0.9); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, -40px) scale(0.95); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 4s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  
  .animate-float-slow {
    animation: float-slow 5s ease-in-out infinite;
    animation-delay: 1s;
  }
`}</style>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT: About Text */}
          <div className="lg:order-1 space-y-8">
            <div className="text-center lg:text-left mb-12 lg:mb-0">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-sm font-bold rounded-full shadow-lg mb-6">
                <GraduationCap className="w-4 h-4 mr-2" />
                DVM | Veterinary Surgeon
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent drop-shadow-2xl mb-6 leading-tight">
                Krish Nayak
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                Passionate veterinary surgeon with 8+ years experience in pet healthcare
              </p>
            </div>

            {/* Qualifications */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:bg-emerald-50/60 hover:scale-[1.02] transition-all duration-500 border border-emerald-100/50 cursor-default">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 mb-1">DVM Degree</h4>
                    <p className="text-emerald-700 font-semibold text-sm">Veterinary Medicine</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Bachelor of Veterinary Medicine from Warsaw Veterinary University</p>
              </div>

              <div className="group p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:bg-teal-50/60 hover:scale-[1.02] transition-all duration-500 border border-teal-100/50 cursor-default">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Stethoscope className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900 mb-1">8+ Years</h4>
                    <p className="text-teal-700 font-semibold text-sm">Experience</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Specializing in small animal surgery, emergency care & preventive medicine</p>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white/70 backdrop-blur-xl p-8 lg:p-10 rounded-3xl shadow-2xl border border-gray-200/50 hover:shadow-emerald-300/30 transition-all duration-500">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                About Krish
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Krish Nayak is a dedicated veterinary surgeon with a deep passion for animal welfare. Having treated over 5000 pets, he combines 
                cutting-edge medical knowledge with genuine compassion for every animal under his care.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                "Every pet deserves the best care possible" - Krish Nayak
              </p>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="lg:order-2">
            <div 
              className="relative group cursor-pointer mx-auto max-w-sm lg:max-w-md"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              {/* Image Container */}
              <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-700 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                {/* First Image - Default */}
                <img 
                  src="/images/pp2.jpeg"
                  alt="Dr. Krish Nayak"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    imageHover 
                      ? 'opacity-0 scale-110' 
                      : 'opacity-100 scale-100'
                  }`}
                />
                
                {/* Second Image - On Hover */}
                <img 
                  src="/images/pp3.png"
                  alt="Dr. Krish Nayak - Hover"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    imageHover 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-90'
                  }`}
                />
                
                {/* Light Name Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-700 p-6`}>
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-1">
                      Dr. Krish Nayak
                    </h3>
                    <p className="text-emerald-200 text-xs md:text-sm font-medium uppercase tracking-wide">
                      Veterinary Surgeon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 text-center">
              {[
                { num: '5000+', label: 'Pets Treated' },
                { num: '8+', label: 'Years Exp.' },
                { num: '98%', label: 'Success Rate' }
              ].map((stat, idx) => (
                <div key={idx} className="group p-4 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-emerald-300/50 hover:scale-105 transition-all duration-400 border border-emerald-100/50">
                  <div className="text-2xl md:text-3xl font-black text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                    {stat.num}
                  </div>
                  <div className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            {/* ADD THIS NEW CODE HERE - Why Choose Us Button */}
<div className="mt-8 text-center">
  
    <a href="/more"
    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
  >
    <Heart className="w-5 h-5 mr-2" />
    Why Choose Us?
  </a>
</div>
{/* END OF NEW CODE */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;