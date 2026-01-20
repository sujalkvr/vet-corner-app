import { useEffect, useRef } from 'react';

const Load = ({ onLoadComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
    }

    // Pause video at 2.5s and navigate
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      onLoadComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 bg-white z-[10000] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Animated Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black
        bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600
        bg-clip-text text-transparent mb-10 animate-pop">
        Expert Vet Care - Simplified
      </h1>

      {/* Video (UNCHANGED) */}
      <video
        ref={videoRef}
        className="w-64 md:w-80 lg:w-96"
        autoPlay
        muted
        playsInline
        onEnded={onLoadComplete} // fallback
      >
        <source src="/videos/loading.mp4" type="video/mp4" />
      </video>

      <style>{`
        @keyframes pop {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          60% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-pop {
          animation: pop 0.9s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Load;
