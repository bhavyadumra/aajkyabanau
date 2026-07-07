'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const COLORS = [
  ['#ff6b9d', '#e91e8c'], // Pink
  ['#a78bfa', '#7c3aed'], // Purple
  ['#34d399', '#059669'], // Mint
  ['#fbbf24', '#d97706'], // Amber
  ['#38bdf8', '#0284c7'], // Sky Blue
];

export interface SpinWheelHandle {
  spin: (winnerIndex: number) => void;
}

interface SpinWheelProps {
  options: string[];
  onSpinEnd: (index: number) => void;
  isSpinning: boolean;
  onSpinningChange: (v: boolean) => void;
  highlightIndex: number | null;
}

const SpinWheel = forwardRef<SpinWheelHandle, SpinWheelProps>(
  ({ options, onSpinEnd, isSpinning, onSpinningChange, highlightIndex }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentAngleRef = useRef(0);
    const rafRef = useRef<number>(0);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const lastTickSegRef = useRef<number>(-1);

    // Expose spin() to parent
    useImperativeHandle(ref, () => ({
      spin: (winnerIndex: number) => {
        if (isSpinning || options.length < 2) return;
        onSpinningChange(true);
        lastTickSegRef.current = -1;

        const segAngle = (2 * Math.PI) / options.length;
        // Target: winner segment lands under the top pointer
        // Pointer is at top (angle = -PI/2), we want winner to be centered there
        const extraSpins = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
        const targetAngle =
          extraSpins +
          (2 * Math.PI - ((winnerIndex * segAngle) + segAngle / 2)) -
          (currentAngleRef.current % (2 * Math.PI));

        const startAngle = currentAngleRef.current;
        const totalChange = targetAngle;
        const duration = 4200;
        let startTime: number | null = null;

        const tick = (now: number) => {
          if (!startTime) startTime = now;
          const elapsed = now - startTime;
          const t = Math.min(elapsed / duration, 1);
          // Cubic ease-out
          const eased = 1 - Math.pow(1 - t, 3);
          currentAngleRef.current = startAngle + totalChange * eased;

          // Tick sound
          const currentSeg = Math.floor(
            ((currentAngleRef.current % (2 * Math.PI)) / (2 * Math.PI)) * options.length
          );
          if (currentSeg !== lastTickSegRef.current) {
            lastTickSegRef.current = currentSeg;
            playTick();
          }

          drawWheel(currentAngleRef.current, null);

          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            onSpinningChange(false);
            onSpinEnd(winnerIndex);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      },
    }));

    const playTick = () => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch {}
    };

    const drawWheel = (angle: number, highlight: number | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = canvas.width;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 8;

      ctx.clearRect(0, 0, size, size);

      if (options.length === 0) return;

      const segAngle = (2 * Math.PI) / options.length;

      options.forEach((label, i) => {
        const startA = angle + i * segAngle - Math.PI / 2;
        const endA = startA + segAngle;
        const colorSet = COLORS[i % COLORS.length];
        const isHighlighted = highlight === i;

        // Segment
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startA, endA);
        ctx.closePath();

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, isHighlighted ? '#fff' : colorSet[0]);
        grad.addColorStop(1, isHighlighted ? colorSet[0] : colorSet[1]);
        ctx.fillStyle = grad;
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        const midA = startA + segAngle / 2;
        const textR = radius * 0.68;
        const tx = cx + textR * Math.cos(midA);
        const ty = cy + textR * Math.sin(midA);

        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(midA + Math.PI / 2);

        // Emoji
        const fontSize = Math.max(10, Math.min(18, (2 * Math.PI * radius) / options.length / 2.8));
        ctx.font = `${fontSize}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label.split(' ')[0], 0, -fontSize * 0.7);

        // Label text
        const labelSize = Math.max(8, Math.min(12, fontSize * 0.7));
        ctx.font = `600 ${labelSize}px Inter, sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 3;

        // Trim label if needed
        const words = label.split(' ').slice(1).join(' ') || label;
        const maxChars = Math.max(5, Math.floor((2 * Math.PI * radius) / options.length / labelSize * 1.5));
        const displayLabel = words.length > maxChars ? words.slice(0, maxChars - 1) + '…' : words;
        ctx.fillText(displayLabel, 0, fontSize * 0.5);

        ctx.restore();
      });

      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
      centerGrad.addColorStop(0, '#fff');
      centerGrad.addColorStop(1, '#fce4ec');
      ctx.fillStyle = centerGrad;
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.strokeStyle = '#e91e8c';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pointer triangle at top
      const pointerH = 24;
      const pointerW = 14;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius + pointerH);
      ctx.lineTo(cx - pointerW / 2, cy - radius - 6);
      ctx.lineTo(cx + pointerW / 2, cy - radius - 6);
      ctx.closePath();
      const pGrad = ctx.createLinearGradient(cx, cy - radius - 6, cx, cy - radius + pointerH);
      pGrad.addColorStop(0, '#e91e8c');
      pGrad.addColorStop(1, '#ff6b9d');
      ctx.fillStyle = pGrad;
      ctx.shadowColor = 'rgba(233,30,140,0.5)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // Resize + redraw on option/highlight changes
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const resize = () => {
        const w = Math.min(parent.clientWidth, 480);
        canvas.width = w;
        canvas.height = w;
        drawWheel(currentAngleRef.current, highlightIndex);
      };

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(parent);
      return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, highlightIndex]);

    useEffect(() => {
      drawWheel(currentAngleRef.current, highlightIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlightIndex, options]);

    useEffect(() => {
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="drop-shadow-2xl rounded-full"
        style={{
          display: 'block',
          margin: '0 auto',
          cursor: isSpinning ? 'wait' : 'default',
          transition: 'opacity 0.2s',
          opacity: options.length === 0 ? 0.4 : 1,
        }}
      />
    );
  }
);

SpinWheel.displayName = 'SpinWheel';
export default SpinWheel;
