import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const faqs = [
    {
      question: "Do you have home vet visit facility?",
      answer: "Yes, we do provide home visit consultation, Only in specific locations, please check the scrolling bar for current available locations."
    },
    {
      question: "What is teleconsultation?",
      answer: "An online consultation allows you to speak with a licensed veterinarian via video or chat from the comfort of your home"
    },
    {
      question: "Can all pets be treated online?",
      answer: "Yes, most dogs and cats can receive online guidance. Emergencies or conditions requiring physical examination must be handled at a clinic."
    },
    {
      question: "How should I prepare?",
      answer: "Keep your pet calm and in view of the camera. Have medical records ready. Note down your questions."
    },
    {
      question: "Will I get prescriptions?",
      answer: "Yes, digital prescriptions are provided where appropriate."
    },
    {
      question: "When do I need teleconsultation? ",
      answer: "Sudden changes in appetite, digestive issues, skin concerns, mobility problems, respiratory signs,preventive care. No matter the reason, ourteam is committed to identify the cause and improving your pets quality of life."
    },
    {
      question: "Refund Policy",
      answer: "Full refund: ≥24 hours before consultation. Partial refund: <24 hours. No refund once consultation has started."
    }
  ];

  const reviews = [
    { name: 'Keerthana P.', rating: 5, text: 'Dr. Krish saved my puppy! His expertise and care were exceptional.' },
    { name: 'Yash.', rating: 5, text: 'Cant thank enough. My cat recovered quickly from surgery,Thanks to Dr. Krish.' },
    { name: 'Gayathri Reddy.', rating: 5, text: 'Smooth vaccination process. Great service by Dr. krish Nayak and staff.' },
    { name: 'Vijay Pal', rating: 5, text: 'Emergency care was perfect - truly a lifesaver for my dog. Kudos Dr. Krish Sir!' },
    { name: 'Arora.', rating: 5, text: 'Consulting Dr. Krish from last 1 year. Always guides well.' },
    { name: 'Revathi.', rating: 5, text: 'My lab lost 10kg with their diet plan. Excellent guidance!' },
    { name: 'Famida.', rating: 5, text: 'My cat spay surgery Performed by Dr. krish . Recovered well, Highly reccommend him.' },
    { name: 'Rohit Korada.', rating: 5, text: 'Puppy vaccines done right. Very professional service.' },
    { name: 'Monika SN.', rating: 5, text: 'Painless Vaccination. My cat didn\'t even notice!' },
    { name: 'Teja Sri.', rating: 5, text: '3 years of excellent care. We trust Dr. Krish completely.' }
  ];

  // Triple the reviews for seamless loop
  const allReviews = [...reviews, ...reviews, ...reviews];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-800 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-green-600 text-lg">
            Find answers to common questions about our services
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FAQ Section - Left Side */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-green-600 shadow-xl scale-105'
                    : 'bg-white shadow-md hover:shadow-lg'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group"
                >
                  <span
                    className={`font-semibold text-lg pr-4 transition-colors ${
                      activeIndex === index
                        ? 'text-white'
                        : 'text-gray-800 group-hover:text-green-700'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      activeIndex === index
                        ? 'bg-white text-green-600 rotate-180'
                        : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div
                    className={`px-6 pb-5 ${
                      activeIndex === index ? 'text-green-50' : 'text-gray-600'
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews Carousel Section - Right Side */}
          <div className="flex flex-col justify-center">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-black bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Happy Pet Parents
              </h2>
              <p className="text-lg text-gray-700">
                When compassion meets trust
              </p>
            </div>

            <div 
              className="relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-green-50 via-green-50/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-green-50 via-green-50/80 to-transparent z-10 pointer-events-none" />

              {/* Scrolling Container */}
              <div className="flex">
                <div 
                  className={`flex gap-4 ${isPaused ? '' : 'animate-scroll-vertical'}`}
                  style={{
                    animationPlayState: isPaused ? 'paused' : 'running'
                  }}
                >
                  {allReviews.map((review, idx) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-72"
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-green-100 p-6 h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
                        
                        {/* Stars */}
                        <div className="flex justify-center mb-4 space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-5 h-5 text-amber-400 fill-amber-400"
                            />
                          ))}
                        </div>
                        
                        {/* Review Text */}
                        <p className="text-center font-medium text-gray-700 text-sm leading-relaxed mb-4 flex-1">
                          "{review.text}"
                        </p>
                        
                        {/* Reviewer Name */}
                        <div className="text-center pt-3 border-t border-green-100">
                          <h4 className="font-bold text-base text-gray-900">
                            {review.name}
                          </h4>
                          <p className="text-xs text-green-600 font-semibold mt-1">
                            Verified Customer
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover Instruction */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 font-medium">
                  {isPaused ? '⏸️ Paused' : '✨ Hover to pause'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-vertical {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-304px * 10));
          }
        }
        
        .animate-scroll-vertical {
          animation: scroll-vertical 50s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Faq;
