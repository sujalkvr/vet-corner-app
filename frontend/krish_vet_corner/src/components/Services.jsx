import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const [openModal, setOpenModal] = useState(null);
  const [openExpertise, setOpenExpertise] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const openHandler = () => setOpenExpertise(true);
    window.addEventListener("openExpertise", openHandler);
    return () => window.removeEventListener("openExpertise", openHandler);
  }, []);

  const services = [
    {
      id: 1,
      title: "Online Consultation",
      subtitle: "Fee:Rs 299/-",
      brief:
        "Includes 3 days free followup chats for Comprehensive health assessments and diagnostics.Personalized treatment recommendations.",
      bgColor: "from-emerald-400/80 to-teal-500/80",
      image: "images/services1.jpeg",
      details:
        "For Rs 299/-. Our expert veterinarians provide thorough consultations to diagnose and treat your pet's health issues. From routine checkups to complex medical conditions, we create personalized treatment plans tailored to your pet's specific needs and lifestyle.",
      features: [
        "Routine health checkups",
        "Diagnostic examinations",
        "Treatment planning",
        "Health counseling",
      ],
    },
    {
      id: 2,
      title: "Home Visit",
      subtitle: "Fee:Rs 1499/-",
      brief: [
        "We provide convenient,in-home veterinary services,reducing stress for pets while providing high-quality care for non-emergency issues like check-ups,vaccinations,and chronic care management.",
        // "reducing stress for pets while providing high-quality care for non-emergency issues like check-ups, vaccinations, and chronic care management.",
      ],
      bgColor: "from-blue-400/80 to-emerald-500/80",
      image: "images/services2.jpg",
      details:
        "For Rs 1499/- We provide convenient, in-home veterinary services,vaccination for puppies, kittens, and adult. (NOTE: VACCINES, INJECTIONS NAD MEDICINES ARE SEPEARTELY CHARGEBLE) ",
      features: [
        "Puppy/Kitten series",
        "Adult boosters",
        "General consults",
        "Blood Diagnotic Tests",
      ],
    },
    {
      id: 3,
      title: "Vet Student Support",
      subtitle: "Fee: Rs 299/-",
      brief:
        "Dedicated guidance and support for young veterinarians in Carrer support & Job refferals.",
      bgColor: "from-purple-400/80 to-pink-500/80",
      image: "images/services3.jpg",
      details:
        "For Rs 299/- We provides remote guidance to recent graduates, assisting with case diagnostics, treatment plans, and client communication using live video/chat. These experts help bridge the gap between education and clinical practice, enhancing decision-making and boosting confidence in a supportive, virtual environment.",
      features: [
        "Career& Overseas guidance-NAVLE/MRCVS/AVE",
        "Spay & Neuter Training",
        "Client Communication",
        "Handling Emergency cases",
      ],
    },
  ];

  const currentService = services.find((s) => s.id === openModal);

  // Desktop: Show 3 at a time
  const visibleServicesDesktop = services.slice(currentIndex, currentIndex + 3);
  const canGoPreviousDesktop = currentIndex > 0;
  const canGoNextDesktop = currentIndex < services.length - 3;

  // // Mobile: Show 1 at a time
  // const visibleServiceMobile = services[currentIndex];
  // const canGoPreviousMobile = currentIndex > 0;
  // const canGoNextMobile = currentIndex < services.length - 1;

  const handlePreviousDesktop = () => {
    if (canGoPreviousDesktop) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextDesktop = () => {
    if (canGoNextDesktop) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // const handlePreviousMobile = () => {
  //   if (canGoPreviousMobile) {
  //     setCurrentIndex((prev) => prev - 1);
  //   }
  // };

  // const handleNextMobile = () => {
  //   if (canGoNextMobile) {
  //     setCurrentIndex((prev) => prev + 1);
  //   }
  // };

  return (
    <section
      id="services"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 drop-shadow-xl mb-4 sm:mb-6 leading-tight px-2">
            Our Core Services
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed px-4">
            Professional veterinary care tailored for your pet's unique needs
          </p>
        </div>
        {/* Desktop View (3 cards with navigation) - Hidden on mobile */}
        <div className="hidden lg:block relative mb-20">
          {/* Navigation Buttons for Desktop */}
          {services.length > 3 && (
            <>
              <button
                onClick={handlePreviousDesktop}
                disabled={!canGoPreviousDesktop}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 ${
                  canGoPreviousDesktop
                    ? "hover:bg-emerald-500 hover:text-white hover:scale-110 text-emerald-600"
                    : "opacity-30 cursor-not-allowed text-gray-400"
                }`}
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={handleNextDesktop}
                disabled={!canGoNextDesktop}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 ${
                  canGoNextDesktop
                    ? "hover:bg-emerald-500 hover:text-white hover:scale-110 text-emerald-600"
                    : "opacity-30 cursor-not-allowed text-gray-400"
                }`}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {visibleServicesDesktop.map((service) => (
              <div
                key={service.id}
                className="relative h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-emerald-500/30 hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 cursor-pointer group"
                onClick={() => setOpenModal(service.id)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                <div
                  className={`absolute inset-0 ${service.bgColor} opacity-20 group-hover:opacity-30 transition-opacity duration-700 backdrop-blur-sm`}
                />

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
                    {Array.isArray(service.brief)
                      ? service.brief.map((sentence, idx) => (
                          <span key={idx} className="block mb-1 last:mb-0">
                            {sentence}
                          </span>
                        ))
                      : service.brief.split(". ").map((sentence, idx) => (
                          <span key={idx} className="block mb-1 last:mb-0">
                            {sentence.trim()}.
                          </span>
                        ))}
                  </div>
                  <div className="text-center">
                    <button className="group/btn relative px-10 py-4 bg-white/30 backdrop-blur-xl border-2 border-white/60 text-white font-bold text-sm md:text-base rounded-2xl shadow-xl hover:bg-white/60 hover:border-white/80 hover:shadow-2xl hover:scale-105 transition-all duration-400">
                      <span className="flex items-center justify-center space-x-2">
                        <span>Learn More</span>
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots for Desktop */}
          {services.length > 3 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: services.length - 2 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "bg-emerald-600 w-8"
                      : "bg-emerald-300 hover:bg-emerald-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden mb-12 sm:mb-20 overflow-x-auto flex gap-4 px-4 snap-x snap-mandatory">
          {services.map((service) => (
            <div
              key={service.id}
              className="min-w-[95%] snap-center relative h-[420px] rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 cursor-pointer"
              onClick={() => setOpenModal(service.id)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${service.image})` }}
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute inset-0 p-4 flex flex-col justify-center text-white text-center">
                <h3 className="text-2xl font-bold">{service.title}</h3>

                <p className="text-sm mt-2">{service.subtitle}</p>

                <div className="text-xs mt-3 mb-4">
                  {Array.isArray(service.brief)
                    ? service.brief.map((line, i) => <div key={i}>{line}</div>)
                    : service.brief
                        .split(". ")
                        .map((line, i) => <div key={i}>{line}.</div>)}
                </div>

                {/* 🔥 BUTTON IS BACK */}
                <button className="mx-auto px-6 py-2 bg-white/30 backdrop-blur-md border border-white/60 rounded-xl text-sm font-bold hover:bg-white/60 transition">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-16 sm:mt-20">
        <button
          onClick={() => setOpenExpertise(true)}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg sm:text-xl font-bold shadow-xl hover:shadow-emerald-400/50 hover:scale-105 transition-all duration-300"
        >
          <Stethoscope className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          <span>Our Expertise</span>
        </button>
      </div>

      {/* Modal */}
      {openModal && currentService && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 md:p-8"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col border-4 border-emerald-200/20 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-8 pt-3 sm:pt-4 pb-4 sm:pb-6 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white z-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-xl pr-2">
                {currentService.title}
              </h3>
              <button
                onClick={() => setOpenModal(null)}
                className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-emerald-500/90 hover:bg-emerald-600 text-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-emerald-400/50 hover:scale-110 transition-all duration-200 flex items-center justify-center text-lg sm:text-xl font-bold border-2 border-white/30"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-8 flex-1">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-light mb-6 sm:mb-8">
                {currentService.details}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {currentService.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-emerald-50/80 backdrop-blur-sm rounded-xl border border-emerald-200/50 hover:bg-emerald-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full shadow-sm flex-shrink-0" />
                    <span className="font-medium text-gray-800 text-xs sm:text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 sm:px-8 pb-4 sm:pb-8 pt-4 sm:pt-6 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-b-2xl sm:rounded-b-3xl border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/appointment"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300 text-center text-base sm:text-lg flex items-center justify-center space-x-2 group"
              >
                <span>Book {currentService.title}</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <button
                onClick={() => setOpenModal(null)}
                className="sm:flex-shrink-0 px-6 sm:px-8 py-3 sm:py-4 border-2 border-emerald-300/70 bg-white text-emerald-700 font-bold rounded-xl sm:rounded-2xl hover:bg-emerald-50 hover:shadow-lg hover:border-emerald-400 hover:scale-[1.02] transition-all duration-300 text-base sm:text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openExpertise && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setOpenExpertise(false)}
        >
          <div className="relative w-full max-w-xl">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpenExpertise(false)}
              className="absolute -top-4 -right-4 z-[1001] w-12 h-12 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"
            >
              ✕
            </button>

            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* LIST */}
              <div className="flex gap-8">
                <div className="flex flex-col gap-3">
                  <div>Ophthalmology</div>
                  <div>Internal Medicine</div>
                  <div>Oncology</div>
                  <div>Dermatology</div>
                  <div>Dental Care</div>
                  <div>Nutrition</div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>Soft Tissue & Orthopedic Surgeries</div>
                  <div>Spay & Neuter</div>
                  <div>Cardiology</div>
                  <div>Gynecology</div>
                  <div>Emergency Care</div>
                  <div>Diagnostics imaging</div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <Link
                  to="/appointment"
                  className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Services;
