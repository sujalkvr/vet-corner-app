import { useState, useEffect } from 'react';
import { Users, Award, ChevronLeft, ChevronRight, X, Stethoscope } from 'lucide-react';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team');
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, teamMembers.length - 3) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= teamMembers.length - 3 ? 0 : prev + 1));
  };

  const openModal = (member) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl animate-bounce">🐾</div>
          <p className="text-gray-600 mt-4">Loading our amazing team...</p>
        </div>
      </section>
    );
  }

  const visibleMembers = teamMembers.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < teamMembers.length - 3;

  return (
    <>
      <section id="team" className="py-20 bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-2xl">
              <Users className="text-white" size={40} />
            </div>
            <h2 className="text-5xl font-black mb-4 text-green-800">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-green-600 max-w-2xl mx-auto">
              Dedicated professionals committed to providing the best care for your beloved pets
            </p>
          </div>

          {/* Team Members Carousel */}
          {teamMembers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
              <Users className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-xl">Our team information is coming soon!</p>
            </div>
          ) : (
            <div className="relative">
              {/* Navigation Buttons */}
              {teamMembers.length > 3 && (
                <>
                  <button
                    onClick={handlePrevious}
                    disabled={!canGoPrevious}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 ${
                      canGoPrevious 
                        ? 'hover:bg-green-500 hover:text-white hover:scale-110 text-green-600' 
                        : 'opacity-30 cursor-not-allowed text-gray-400'
                    }`}
                  >
                    <ChevronLeft size={28} />
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 ${
                      canGoNext 
                        ? 'hover:bg-green-500 hover:text-white hover:scale-110 text-green-600' 
                        : 'opacity-30 cursor-not-allowed text-gray-400'
                    }`}
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                {visibleMembers.map((member, index) => (
                  <div
                    key={member._id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-green-100 hover:border-green-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Section */}
                    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-green-100 to-green-50">
                      <img
                        src={`http://localhost:5000${member.image}`}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x500?text=Team+Member';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-green-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-4 right-4 w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                        <Stethoscope className="text-green-600" size={26} />
                      </div>

                      {/* Name Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Award className="text-green-300" size={20} />
                          <p className="text-green-100 font-semibold text-base">
                            {member.degree}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="p-6 bg-white">
                      <button
                        onClick={() => openModal(member)}
                        className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>Read More</span>
                        <span className="text-lg">→</span>
                      </button>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-green-200/30 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              {teamMembers.length > 3 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.ceil(teamMembers.length / 3) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx * 3)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        Math.floor(currentIndex / 3) === idx 
                          ? 'bg-green-600 w-8' 
                          : 'bg-green-300 hover:bg-green-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white rounded-2xl shadow-lg border-2 border-green-200">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="text-green-600" size={20} />
              </div>
              <p className="text-lg font-semibold text-gray-800">
                Want to join our team? <a href="#contact" className="text-green-600 hover:text-green-800 underline transition-colors">Get in touch</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Popup */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Image */}
            <div className="relative h-72 bg-gradient-to-br from-green-100 to-green-50">
              <img
                src={`http://localhost:5000${selectedMember.image}`}
                alt={selectedMember.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Team+Member';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/40 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg group"
              >
                <X className="text-green-600 group-hover:text-green-700" size={24} />
              </button>

              {/* Name and Degree Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {selectedMember.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Award className="text-green-300" size={22} />
                  <p className="text-green-100 font-semibold text-lg">
                    {selectedMember.degree}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <Users size={24} />
                About
              </h4>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {selectedMember.description}
              </p>

              {/* Close Button at Bottom */}
              <button
                onClick={closeModal}
                className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default Team;