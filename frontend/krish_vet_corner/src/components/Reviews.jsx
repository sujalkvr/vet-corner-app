import { useState } from 'react';
import { Star } from 'lucide-react';

const Reviews = () => {
  const [isPaused, setIsPaused] = useState(false);

  const reviews = [
    { name: 'rohan K.', rating: 5, text: 'Dr. Krish saved my puppy! His expertise and care were exceptional.' },
    { name: 'mukul N.', rating: 5, text: 'Best vet in Warsaw. My cat recovered quickly from surgery.' },
    { name: 'surya Z.', rating: 5, text: 'Smooth vaccination process. Great service and friendly staff.' },
    { name: 'thalapathy vijay.', rating: 5, text: 'Emergency care was perfect - truly a lifesaver for my dog!' },
    { name: 'samantha L.', rating: 5, text: 'Perfect dental surgery. My pet is happy and healthy now.' },
    { name: 'vijay s.', rating: 5, text: 'My lab lost 10kg with their diet plan. Excellent guidance!' },
    { name: 'anuska S.', rating: 5, text: 'Grooming plus checkup combo was perfect and affordable.' },
    { name: 'Michał J.', rating: 5, text: 'Puppy vaccines done right. Very professional service.' },
    { name: 'Monika W.', rating: 5, text: 'Painless dental extraction. My cat didn\'t even notice!' },
    { name: 'Robert M.', rating: 5, text: '8 years of excellent care. We trust Dr. Krish completely.' }
  ];

  // Triple the reviews for seamless loop
  const allReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-20 px-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-xl mb-4">
            Happy Pet Parents
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-light max-w-2xl mx-auto">
            Trusted by thousands across Warsaw
          </p>
        </div>
      </div>

      {/* Conveyor Belt Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Container */}
        <div className="flex gap-6">
          <div 
            className={`flex gap-6 ${isPaused ? '' : 'animate-scroll'}`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {allReviews.map((review, idx) => (
              <div 
                key={idx} 
                className="flex-shrink-0 w-80 group"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-emerald-300/40 border border-emerald-100/50 p-8 h-full flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                  
                  {/* Stars */}
                  <div className="flex justify-center mb-6 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-center font-medium text-gray-700 text-base leading-relaxed mb-6 flex-1">
                    "{review.text}"
                  </p>
                  
                  {/* Reviewer Name */}
                  <div className="text-center pt-4 border-t border-emerald-100">
                    <h4 className="font-bold text-xl text-gray-900">
                      {review.name}
                    </h4>
                    <p className="text-sm text-emerald-600 font-semibold mt-1">
                      Verified Customer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hover Instruction */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-medium">
            {isPaused ? '⏸️ Paused' : '✨ Hover to pause'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-336px * 10));
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Reviews;