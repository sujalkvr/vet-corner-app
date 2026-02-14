import { useEffect, useState } from "react";
import { API_URL } from "../api";
const NotificationBanner = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      // Fallback demo notifications for testing
      setNotifications([
        { id: 1, content: "Welcome to our platform!" },
        { id: 2, content: "New features available now" },
        { id: 3, content: "Check out our latest updates" },
        { id: 4, content: "Special offer - Limited time only" }
      ]);
    }
  };

  if (notifications.length === 0 || !isVisible) return null;

  // Create many duplicates for truly infinite scroll
  const infiniteNotifications = Array(10).fill(notifications).flat();

  return (
    <div style={{
      backgroundColor: '#059669',
      overflow: 'hidden',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 9999
    }}>
      <div style={{
        display: 'flex',
        animation: 'scrollContinuous 40s linear infinite',
        whiteSpace: 'nowrap',
        willChange: 'transform'
      }}>
        {infiniteNotifications.map((item, index) => (
          <span
            key={index}
            style={{
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              paddingRight: '80px',
              display: 'inline-block'
            }}
          >
            {item.content}
          </span>
        ))}
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '4px 8px',
          lineHeight: '1',
          fontWeight: 'bold',
          zIndex: 10
        }}
        aria-label="Close notifications"
      >
        ✕
      </button>
      
      <style>{`
        @keyframes scrollContinuous {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationBanner;