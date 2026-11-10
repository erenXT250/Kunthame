import React, { useMemo, useState, useEffect } from 'react';

interface AmbientStarfieldProps {
  className?: string;
}

export const AmbientStarfield: React.FC<AmbientStarfieldProps> = ({ className = '' }) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stars = useMemo(() => {
    const count = isMobile ? 26 : 48;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(Math.random() * 100).toFixed(1)}%`,
      top: `${(Math.random() * 100).toFixed(1)}%`,
      size: Math.random() > 0.8 ? 2.2 : Math.random() > 0.5 ? 1.6 : 1.0,
      duration: (3 + Math.random() * 3.5).toFixed(1),
      delay: (Math.random() * 4).toFixed(1),
      opacity: (0.35 + Math.random() * 0.5).toFixed(2),
    }));
  }, [isMobile]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 gpu-layer ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-romantic-gradient" />

      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] rounded-full bg-pink-600/15 blur-[60px] sm:blur-[110px] animate-glow-breathe gpu-layer"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[220px] sm:w-[380px] h-[220px] sm:h-[380px] rounded-full bg-purple-600/20 blur-[50px] sm:blur-[100px] animate-pulse-subtle gpu-layer"
      />
      <div
        className="absolute top-3/4 left-1/4 w-[180px] sm:w-[300px] h-[180px] sm:h-[300px] rounded-full bg-rose-500/10 blur-[45px] sm:blur-[90px] gpu-layer"
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,2,14,0.75)_100%)]" />

      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-pink-100 will-change-opacity"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 192, 203, 0.7)`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          0% {
            opacity: 0.15;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.25;
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};
