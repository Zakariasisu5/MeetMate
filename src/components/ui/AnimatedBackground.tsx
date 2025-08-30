import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbles: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 60 + 20,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)'); // Blue
      gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.1)'); // Purple
      gradient.addColorStop(1, 'rgba(20, 184, 166, 0.1)'); // Teal
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating bubbles
      bubbles.forEach((bubble, index) => {
        const time = Date.now() * 0.001;
        const x = (bubble.x + Math.sin(time + bubble.delay) * 20) * canvas.width / 100;
        const y = (bubble.y + Math.cos(time + bubble.delay) * 15) * canvas.height / 100;
        
        ctx.beginPath();
        ctx.arc(x, y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.sin(time + bubble.delay) * 0.02})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Additional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
    </div>
  );
};

export default AnimatedBackground;

