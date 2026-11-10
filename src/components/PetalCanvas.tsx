import React, { useEffect, useRef } from 'react';

interface PetalCanvasProps {
  intensity?: 'normal' | 'celebration';
  className?: string;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  colorType: number;
  isCelebration?: boolean;
  shapeType?: 'petal' | 'heart';
}

const PETAL_COLORS = [
  { main: 'rgba(255, 182, 193, ', shadow: 'rgba(244, 114, 182, ' },
  { main: 'rgba(255, 192, 203, ', shadow: 'rgba(251, 146, 182, ' },
  { main: 'rgba(254, 205, 211, ', shadow: 'rgba(253, 164, 175, ' },
  { main: 'rgba(255, 228, 235, ', shadow: 'rgba(244, 63, 94, ' },
  { main: 'rgba(244, 114, 182, ', shadow: 'rgba(219, 39, 119, ' },
];

export const PetalCanvas: React.FC<PetalCanvasProps> = ({
  intensity = 'normal',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const isCelebrationRef = useRef<boolean>(intensity === 'celebration');

  useEffect(() => {
    isCelebrationRef.current = intensity === 'celebration';
    if (intensity === 'celebration') {
      burstCelebration();
    }
  }, [intensity]);

  const burstCelebration = () => {
    if (!canvasRef.current) return;
    const isMobile = window.innerWidth < 768;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const burstCount = isMobile ? 40 : 65;
    const newPetals: Petal[] = [];

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * (isMobile ? 4.5 : 6);
      newPetals.push({
        x: width / 2 + (Math.random() - 0.5) * 50,
        y: height / 2 + (Math.random() - 0.5) * 50,
        size: (isMobile ? 8 : 10) + Math.random() * 10,
        speedY: Math.sin(angle) * speed - 1.2,
        speedX: Math.cos(angle) * speed,
        swaySpeed: 0.02 + Math.random() * 0.04,
        swayAmplitude: 0.8 + Math.random() * 1.5,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.03 + Math.random() * 0.05,
        opacity: 0.85 + Math.random() * 0.15,
        colorType: Math.floor(Math.random() * PETAL_COLORS.length),
        isCelebration: true,
        shapeType: Math.random() > 0.4 ? 'heart' : 'petal',
      });
    }

    petalsRef.current = [...petalsRef.current, ...newPetals];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const isMobile = width < 768;
    const baseCount = isMobile ? 24 : 45;
    const initialPetals: Petal[] = [];

    for (let i = 0; i < baseCount; i++) {
      initialPetals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (isMobile ? 7 : 8) + Math.random() * 8,
        speedY: 0.8 + Math.random() * 1.4,
        speedX: (Math.random() - 0.5) * 0.5,
        swaySpeed: 0.015 + Math.random() * 0.025,
        swayAmplitude: 0.6 + Math.random() * 1.2,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.015 + Math.random() * 0.03,
        opacity: 0.4 + Math.random() * 0.45,
        colorType: Math.floor(Math.random() * PETAL_COLORS.length),
        shapeType: 'petal',
      });
    }
    petalsRef.current = initialPetals;

    const drawPetal = (
      c: CanvasRenderingContext2D,
      size: number,
      color: (typeof PETAL_COLORS)[0],
      opacity: number
    ) => {
      c.beginPath();
      c.moveTo(0, -size);
      c.bezierCurveTo(size * 0.75, -size * 0.75, size * 0.85, size * 0.35, 0, size);
      c.bezierCurveTo(-size * 0.85, size * 0.35, -size * 0.75, -size * 0.75, 0, -size);
      c.closePath();

      const grad = c.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, `${color.main}${opacity})`);
      grad.addColorStop(0.7, `${color.shadow}${opacity * 0.95})`);
      grad.addColorStop(1, `${color.shadow}${opacity * 0.7})`);

      c.fillStyle = grad;
      c.fill();
    };

    const drawHeart = (
      c: CanvasRenderingContext2D,
      size: number,
      opacity: number
    ) => {
      const s = size * 0.8;
      c.beginPath();
      c.moveTo(0, s * 0.3);
      c.bezierCurveTo(-s, -s * 0.5, -s * 0.6, -s * 1.2, 0, -s * 0.6);
      c.bezierCurveTo(s * 0.6, -s * 1.2, s, -s * 0.5, 0, s * 0.3);
      c.closePath();

      c.fillStyle = `rgba(244, 63, 94, ${opacity * 0.85})`;
      c.fill();
    };

    let isTabVisible = true;
    const handleVisibility = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTimeRef.current = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = (time: number) => {
      if (!isTabVisible) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min((time - lastTimeRef.current) / 16.67, 2.0);
      lastTimeRef.current = time;

      ctx.clearRect(0, 0, width, height);

      const petals = petalsRef.current;
      const isMob = width < 768;
      const targetCount = isCelebrationRef.current
        ? (isMob ? 45 : 75)
        : (isMob ? 24 : 45);

      if (petals.length < targetCount && Math.random() < 0.08) {
        petals.push({
          x: Math.random() * (width + 60) - 30,
          y: -20,
          size: (isMob ? 7 : 8) + Math.random() * 8,
          speedY: 0.8 + Math.random() * 1.4,
          speedX: (Math.random() - 0.5) * 0.5,
          swaySpeed: 0.015 + Math.random() * 0.025,
          swayAmplitude: 0.6 + Math.random() * 1.2,
          swayOffset: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
          flip: Math.random() * Math.PI * 2,
          flipSpeed: 0.015 + Math.random() * 0.03,
          opacity: 0.4 + Math.random() * 0.45,
          colorType: Math.floor(Math.random() * PETAL_COLORS.length),
          shapeType: isCelebrationRef.current && Math.random() > 0.6 ? 'heart' : 'petal',
        });
      }

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];

        p.swayOffset += p.swaySpeed * delta;
        p.rotation += p.rotationSpeed * delta;
        p.flip += p.flipSpeed * delta;

        const breeze = Math.sin(time * 0.0006) * 0.35;
        const sway = Math.sin(p.swayOffset) * p.swayAmplitude;

        if (p.isCelebration) {
          p.speedX *= 0.985;
          p.speedY += 0.035 * delta;
          p.x += (p.speedX + breeze) * delta;
          p.y += p.speedY * delta;
        } else {
          p.x += (p.speedX + sway + breeze) * delta;
          p.y += p.speedY * delta;
        }

        const scaleX = Math.cos(p.flip);
        const scaleY = 1.0;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(scaleX, scaleY);

        if (p.shapeType === 'heart') {
          drawHeart(ctx, p.size, p.opacity);
        } else {
          drawPetal(ctx, p.size, PETAL_COLORS[p.colorType], p.opacity);
        }

        ctx.restore();

        if (p.y > height + 35 || p.x < -50 || p.x > width + 50) {
          if (p.isCelebration) {
            petals.splice(i, 1);
          } else {
            p.y = -25 - Math.random() * 15;
            p.x = Math.random() * (width + 80) - 40;
            p.speedY = 0.8 + Math.random() * 1.4;
            p.flip = Math.random() * Math.PI * 2;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-10 w-full h-full gpu-layer ${className}`}
      aria-hidden="true"
    />
  );
};
