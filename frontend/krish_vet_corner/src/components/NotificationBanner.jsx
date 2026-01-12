// src/components/NotificationBanner.jsx
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

  // Auto-slide notifications
  useEffect(() => {
    if (notifications.length <= 1 || !isVisible || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 4000);

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
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center justify-between py-3 gap-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation - Left Arrow */}
          {notifications.length > 1 && (
            <button
              onClick={handlePrev}
              className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover:scale-110"
              aria-label="Previous notification"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Notification Content */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={`http://localhost:5000${currentNotification.image}`}
                alt="Notification"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-3 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/56?text=🔔';
                }}
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base leading-tight line-clamp-2">
                {currentNotification.content}
              </p>
            </div>

            {/* Dots Indicator */}
            {notifications.length > 1 && (
              <div className="hidden sm:flex items-center gap-1.5">
                {notifications.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? 'w-6 h-2 bg-white'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/70'
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
              className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover:scale-110"
              aria-label="Next notification"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-2 rounded-full bg-white/20 hover:bg-red-500/80 text-white transition-all duration-300 hover:scale-110"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;