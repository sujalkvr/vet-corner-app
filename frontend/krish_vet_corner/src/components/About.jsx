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
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent drop-shadow-2xl mb-6 leading-tight">
                Dr. Krish Banothu
              </h2>
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-sm font-bold rounded-full shadow-lg mb-6">
                <GraduationCap className="w-4 h-4 mr-2" />
                               DVM | BVSC & AH | DipECC

              </span>
               <div className="bg-white/70 backdrop-blur-xl p-8 lg:p-10 rounded-3xl shadow-2xl border border-gray-200/50 hover:shadow-emerald-300/30 transition-all duration-500">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                About Dr. Krish 
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A graduate of Madras Veterinary College, one of India’s most renowned veterinary
institutions, known for its extensive exposure to small animal practice.
Dr. Krish has specialized experience in small animal internal medicine,Emergency & Critical Care and soft tissue surgery.
                
              </p>
            </div>
            </div>

           
            {/* Bio */}
            <div className="bg-white/70 backdrop-blur-xl p-8 lg:p-10 rounded-3xl shadow-2xl border border-gray-200/50 hover:shadow-emerald-300/30 transition-all duration-500">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                About Krish Vet Corner
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
               Krish Vet Corner was founded with a simple but powerful belief: every pet deserves the
right treatment, and every pet parent deserves clear guidance and expert care —
irrespective of location or access to veterinary services.
“I believe continuity of care matters — pet parents shouldn’t have to see a different
veterinarian at every consultation. My goal isn’t to replace in-person veterinary care, but
to complement it by providing timely, evidence-based guidance, clear communication,
and support for informed decisions, especially in stressful or critical moments.” 
                During my years in busy veterinary hospitals, I noticed a recurring challengeconsultations often felt rushed, leaving pet parents with unanswered questions.
I started Krish Vet Corner to bridge this gap. My mission is to bring my expertise directly
to you through teleconsultation, ensuring continuity of care, clear communication, and
personalized guidance.
Beyond treatment, I aim to educate pet parents — helping you understand medications,
preventive care, and best practices for your pet’s health. Through teleconsultation, many
of these outcomes can be achieved remotely, giving you confidence while minimizing
stress for both you and your pet.
I strongly believe that many complications arise from miscommunication or incomplete
understanding. Timely, evidence-based advice — delivered with patience, transparency,
and education — can prevent unnecessary stress, improve outcomes, and empower pet
parents.
Through Krish Vet Corner, my goal is to make veterinary care clearer, calmer, and more
accessible for all pets, while always respecting the importance of in-person examinations
and emergency care when required
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                "Every pet deserves the best care possible" - Dr. Krish
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
                      Krish Vet Corner
                    </h3>
                    <p className="text-emerald-200 text-xs md:text-sm font-medium uppercase tracking-wide">
                      Expert Vet Care- Simplified
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
  
    <a
  href="#team"
  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
>
  <Heart className="w-5 h-5 mr-2" />
  Meet Our Team
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
