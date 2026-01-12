// src/components/NotificationBanner.jsx - CLEAN FULL WIDTH DESIGN
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const NotificationBanner = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications');
      const data = await response.json();
      if (data.length > 0) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Auto-slide notifications every 2.5 seconds
  useEffect(() => {
    if (notifications.length <= 1 || !isVisible || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [notifications.length, isVisible, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + notifications.length) % notifications.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
  };

  if (!isVisible || notifications.length === 0) return null;

  const currentNotification = notifications[currentIndex];

  return (
    <div className="bg-white border-b-2 border-emerald-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center justify-center gap-6 py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation - Left Arrow */}
          {notifications.length > 1 && (
            <button
              onClick={handlePrev}
              className="flex-shrink-0 p-2.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all duration-300 hover:scale-110"
              aria-label="Previous notification"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Notification Content */}
          <div className="flex items-center gap-5 flex-1 max-w-4xl">
            {/* Large Image */}
            <div className="flex-shrink-0">
              <img
                src={`http://localhost:5000${currentNotification.image}`}
                alt="Notification"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-emerald-300 shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80?text=🔔';
                }}
              />
            </div>

            {/* Large Text Content */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-bold text-lg sm:text-xl md:text-2xl leading-tight">
                {currentNotification.content}
              </p>
            </div>

            {/* Dots Indicator */}
            {notifications.length > 1 && (
              <div className="hidden md:flex items-center gap-2.5">
                {notifications.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? 'w-8 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md'
                        : 'w-2.5 h-2.5 bg-gray-300 hover:bg-emerald-300'
                    }`}
                    aria-label={`Go to notification ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Navigation - Right Arrow */}
          {notifications.length > 1 && (
            <button
              onClick={handleNext}
              className="flex-shrink-0 p-2.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all duration-300 hover:scale-110"
              aria-label="Next notification"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-2.5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-110"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Dots Indicator */}
      {notifications.length > 1 && (
        <div className="md:hidden flex justify-center items-center gap-2 pb-3">
          {notifications.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'w-2 h-2 bg-gray-300'
              }`}
              aria-label={`Go to notification ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBanner;