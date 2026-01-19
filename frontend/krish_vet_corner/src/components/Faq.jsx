import React, { useState, useEffect } from 'react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer a comprehensive range of services including web development, mobile app development, UI/UX design, and digital marketing solutions tailored to your business needs."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while more complex applications can take 2-6 months. We'll provide a detailed timeline during our initial consultation."
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is project-based and depends on your specific requirements. We offer flexible payment plans and provide detailed quotes after understanding your needs. Contact us for a free consultation."
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

  // Replace these URLs with your actual image URLs
  const images = [
    "/images/faq1.jpeg",
    "/images/faq2.jpeg",
    "/images/faq3.jpg",
    "/images/faq4.jpg",
    "/images/faq5.jpg",
   
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
          {/* FAQ Section */}
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

          {/* Image Carousel Section */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-white">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    currentImage === index
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-110'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;