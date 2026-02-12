import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const faqs = [
    {
      question: "When do I need teleconsultation?",
      answer: "We offer a comprehensive range of services including web development, mobile app development, UI/UX design, and digital marketing solutions tailored to your business needs."
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
      question: "Do you provide ongoing support?",
      answer: "Yes! We offer various maintenance and support packages to ensure your product continues to perform optimally. This includes updates, bug fixes, and feature enhancements."
    },
    {
      question: "What technologies do you work with?",
      answer: "We work with modern technologies including React, Node.js, Python, Three.js, and various databases. Our team stays updated with the latest industry trends and best practices."
    },
    {
      question: "Can you work with our existing team?",
      answer: "Absolutely! We're experienced in collaborating with in-house teams and can integrate seamlessly into your existing workflow and development processes."
    },
    {
      question: "How do we get started?",
      answer: "Simply reach out through our contact form or email. We'll schedule a free consultation to discuss your project, understand your goals, and provide recommendations on the best approach."
    }
  ];

  const reviews = [
    { name: 'rohan K.', rating: 5, text: 'Dr. Krish saved my puppy! His expertise and care were exceptional.' },
    { name: 'mukul N.', rating: 5, text: 'Best vet in Warsaw. My cat recovered quickly from surgery.' },
    { name: 'surya Z.', rating: 5, text: 'Smooth vaccination process. Great service and friendly staff.' },
    { name: 'thalapathy vijay', rating: 5, text: 'Emergency care was perfect - truly a lifesaver for my dog!' },
    { name: 'samantha L.', rating: 5, text: 'Perfect dental surgery. My pet is happy and healthy now.' },
    { name: 'vijay s.', rating: 5, text: 'My lab lost 10kg with their diet plan. Excellent guidance!' },
    { name: 'anuska S.', rating: 5, text: 'Grooming plus checkup combo was perfect and affordable.' },
    { name: 'Michał J.', rating: 5, text: 'Puppy vaccines done right. Very professional service.' },
    { name: 'Monika W.', rating: 5, text: 'Painless dental extraction. My cat didn\'t even notice!' },
    { name: 'Robert M.', rating: 5, text: '8 years of excellent care. We trust Dr. Krish completely.' }
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
                Trusted by thousands across Warsaw
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