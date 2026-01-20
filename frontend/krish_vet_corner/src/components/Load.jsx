import { useState, useEffect } from 'react';

const Load = ({ onLoadComplete }) => {
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // If video ends, trigger the callback after a short delay
    if (videoEnded) {
      const timer = setTimeout(() => {
        onLoadComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [videoEnded, onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-white z-[10000] flex flex-col items-center justify-center">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-8 animate-fadeIn">
        Krish Vet Corner
      </h1>

      {/* Video */}
      <div className="w-full max-w-md px-4">
        <video
          className="w-full h-auto rounded-2xl shadow-2xl"
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoEnded(true)}
        >
          <source src="/videos/loading.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Optional: Skip button */}
      <button
        onClick={onLoadComplete}
        className="mt-8 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fadeIn"
        style={{ animationDelay: '1s' }}
      >
        Skip Intro
      </button>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Load;