'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import CuisineSelect from '@/components/spin/CuisineSelect';
import DishSetup from '@/components/spin/DishSetup';
import ResultPopup from '@/components/spin/ResultPopup';
import Confetti from '@/components/spin/Confetti';
import { SpinDish } from '@/data/spinData';
import type { SpinWheelHandle } from '@/components/spin/SpinWheel';

// SSR-safe canvas component
const SpinWheel = dynamic(() => import('@/components/spin/SpinWheel'), { ssr: false });

// Slide animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function SpinPage() {
  // Wizard state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  // Data state
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [options, setOptions] = useState<SpinDish[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinDish | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const wheelRef = useRef<SpinWheelHandle>(null);

  // Navigation
  const goToStep = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  // Cuisine selection
  const handleToggleCuisine = (id: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Spin
  const handleSpin = useCallback(() => {
    if (isSpinning || options.length < 2) return;
    setResult(null);
    setHighlightIndex(null);
    const winnerIndex = Math.floor(Math.random() * options.length);
    wheelRef.current?.spin(winnerIndex);
  }, [isSpinning, options]);

  const handleSpinEnd = useCallback(
    (index: number) => {
      setHighlightIndex(index);
      setTimeout(() => {
        setResult(options[index]);
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 3500);
      }, 400);
    },
    [options]
  );

  const handleClose = () => {
    setResult(null);
    setHighlightIndex(null);
  };

  // Step 3 progress bar dots
  const stepLabels = ['Cuisine', 'Dishes', 'Spin!'];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff0f6 0%, #fce4ec 30%, #fff8fb 70%, #f0f4ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: 'fixed', top: -160, right: -120,
          width: 500, height: 500,
          background: 'radial-gradient(circle, #ff6b9d44 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: -160, left: -120,
          width: 500, height: 500,
          background: 'radial-gradient(circle, #a78bfa44 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Progress Bar ── */}
        <div style={{ padding: '24px 24px 0', maxWidth: 400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
            {stepLabels.map((label, i) => {
              const stepNum = i + 1;
              const isDone = step > stepNum;
              const isActive = step === stepNum;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <motion.div
                      animate={{
                        background: isDone
                          ? 'linear-gradient(135deg,#e91e8c,#ff6b9d)'
                          : isActive
                          ? 'linear-gradient(135deg,#ff6b9d,#e91e8c)'
                          : '#fce4ec',
                        color: isDone || isActive ? '#fff' : '#e91e8c',
                        boxShadow: isActive
                          ? '0 0 0 4px rgba(233,30,140,0.20), 0 4px 12px rgba(233,30,140,0.3)'
                          : isDone
                          ? '0 2px 8px rgba(233,30,140,0.2)'
                          : 'none',
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                      }}
                    >
                      {isDone ? '✓' : stepNum}
                    </motion.div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: isDone || isActive ? '#e91e8c' : '#c8a0b8',
                        transition: 'color 0.3s',
                      }}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Connecting line */}
                  {i < stepLabels.length - 1 && (
                    <motion.div
                      animate={{
                        background: step > stepNum ? '#e91e8c' : '#fce4ec',
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: 60,
                        height: 2,
                        borderRadius: 100,
                        marginBottom: 22,
                        marginLeft: 8,
                        marginRight: 8,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Step Content ── */}
        <div style={{ padding: '20px 24px 60px', maxWidth: 800, margin: '0 auto', overflow: 'hidden' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Cuisine Selection */}
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <CuisineSelect
                  selectedCuisines={selectedCuisines}
                  onToggleCuisine={handleToggleCuisine}
                  onNext={() => goToStep(2)}
                />
              </motion.div>
            )}

            {/* Step 2: Dish Setup */}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <DishSetup
                  selectedCuisines={selectedCuisines}
                  options={options}
                  onOptionsChange={setOptions}
                  onSpin={() => goToStep(3)}
                  onBack={() => goToStep(1)}
                />
              </motion.div>
            )}

            {/* Step 3: Spin the Wheel */}
            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, maxWidth: 560, margin: '0 auto' }}>
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    style={{ textAlign: 'center' }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 18px',
                        borderRadius: 100,
                        background: 'rgba(233,30,140,0.08)',
                        border: '1px solid rgba(233,30,140,0.2)',
                        color: '#e91e8c',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        marginBottom: 14,
                      }}
                    >
                      🎡 Step 3 of 3
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg,#e91e8c 0%,#ff6b9d 50%,#ff8c69 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: 6,
                        lineHeight: 1.2,
                      }}
                    >
                      Spin the Wheel! 🎡
                    </h2>
                    <p style={{ color: '#9c6b8a', fontSize: '0.92rem', maxWidth: 400, margin: '0 auto' }}>
                      Let fate decide what you&apos;re cooking today!
                    </p>
                  </motion.div>

                  {/* Wheel card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                      width: '100%',
                      maxWidth: 480,
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(233,30,140,0.12)',
                      borderRadius: 28,
                      padding: '28px 24px',
                      boxShadow: '0 12px 48px rgba(233,30,140,0.12)',
                    }}
                  >
                    <div style={{ width: '100%', position: 'relative' }}>
                      <SpinWheel
                        ref={wheelRef}
                        options={options.map((o) => `${o.emoji} ${o.name}`)}
                        onSpinEnd={handleSpinEnd}
                        isSpinning={isSpinning}
                        onSpinningChange={setIsSpinning}
                        highlightIndex={highlightIndex}
                      />
                    </div>

                    {/* Status text */}
                    {!isSpinning && !result && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        style={{
                          textAlign: 'center',
                          color: '#b07a9e',
                          fontSize: '0.82rem',
                          marginTop: 18,
                          fontWeight: 500,
                        }}
                      >
                        ☝️ Hit the button below to spin!
                      </motion.p>
                    )}
                    {isSpinning && (
                      <p
                        style={{
                          textAlign: 'center',
                          color: '#e91e8c',
                          fontSize: '0.85rem',
                          marginTop: 18,
                          fontWeight: 700,
                          animation: 'pulse 1s ease-in-out infinite',
                        }}
                      >
                        🎡 Spinning...
                      </p>
                    )}
                  </motion.div>

                  {/* Stat badges */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                      { label: `${options.length} Dishes`, icon: '🍽️', color: '#e91e8c' },
                      { label: `${options.filter((o) => o.veg).length} Veg`, icon: '🌿', color: '#16a34a' },
                      { label: `${options.filter((o) => !o.veg).length} Non-Veg`, icon: '🍖', color: '#dc2626' },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '5px 12px',
                          borderRadius: 100,
                          background: '#fff',
                          border: '1px solid #ffb3d1',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: s.color,
                          boxShadow: '0 2px 8px rgba(233,30,140,0.08)',
                        }}
                      >
                        {s.icon} {s.label}
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 480 }}>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => goToStep(2)}
                      disabled={isSpinning}
                      style={{
                        padding: '14px 20px',
                        borderRadius: 16,
                        border: '1.5px solid rgba(233,30,140,0.2)',
                        background: 'rgba(255,255,255,0.95)',
                        color: '#e91e8c',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: isSpinning ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        opacity: isSpinning ? 0.5 : 1,
                      }}
                    >
                      <ArrowLeft size={16} /> Back
                    </motion.button>

                    <motion.button
                      whileHover={!isSpinning ? { scale: 1.03, y: -2 } : {}}
                      whileTap={!isSpinning ? { scale: 0.97 } : {}}
                      onClick={!isSpinning ? handleSpin : undefined}
                      disabled={isSpinning || options.length < 2}
                      style={{
                        flex: 1,
                        padding: '16px 24px',
                        borderRadius: 16,
                        border: 'none',
                        background: !isSpinning && options.length >= 2
                          ? 'linear-gradient(135deg,#ff6b9d 0%,#e91e8c 50%,#c2185b 100%)'
                          : '#fce4ec',
                        color: !isSpinning && options.length >= 2 ? '#fff' : '#e91e8c',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        cursor: isSpinning ? 'wait' : options.length >= 2 ? 'pointer' : 'not-allowed',
                        boxShadow: !isSpinning && options.length >= 2 ? '0 8px 28px rgba(233,30,140,0.4)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        transition: 'all 0.2s',
                      }}
                    >
                      {isSpinning ? (
                        <>
                          <span style={{ animation: 'spinAnim 0.8s linear infinite', display: 'inline-block' }}>🎡</span>
                          Spinning...
                        </>
                      ) : (
                        <>🎡 Spin the Wheel!</>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result popup */}
      <ResultPopup dish={result} onClose={handleClose} />

      {/* Confetti */}
      <Confetti active={confettiActive} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes spinAnim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
