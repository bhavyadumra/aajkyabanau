'use client';

import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
}

const COLORS = ['#ff6b9d', '#e91e8c', '#fbbf24', '#34d399', '#a78bfa', '#38bdf8', '#f472b6', '#fb923c'];
const COUNT = 80;

export default function Confetti({ active }: ConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;

    // Clear previous
    container.innerHTML = '';

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = 6 + Math.random() * 8;
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const duration = 2 + Math.random() * 2;
      const rotation = Math.random() * 360;
      const shape = Math.random() > 0.5 ? '50%' : '2px';

      el.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${shape};
        animation: confettiFall ${duration}s ease-in ${delay}s forwards;
        transform: rotate(${rotation}deg);
        opacity: 0;
      `;
      container.appendChild(el);
    }

    const timer = setTimeout(() => {
      if (container) container.innerHTML = '';
    }, 3500);

    return () => clearTimeout(timer);
  }, [active]);

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translateY(120vh) rotate(720deg) scale(0.5); }
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      />
    </>
  );
}
