'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Shuffle, X, Trash2, Sparkles, ArrowLeft } from 'lucide-react';
import { spinCuisines, SpinDish } from '@/data/spinData';

interface DishSetupProps {
  selectedCuisines: string[];
  options: SpinDish[];
  onOptionsChange: (opts: SpinDish[]) => void;
  onSpin: () => void;
  onBack: () => void;
}

export default function DishSetup({
  selectedCuisines,
  options,
  onOptionsChange,
  onSpin,
  onBack,
}: DishSetupProps) {
  const [dishCount, setDishCount] = useState(Math.min(options.length || 6, 12));
  const [customInput, setCustomInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Get all dishes from selected cuisines
  const availableDishes = useCallback(() => {
    return spinCuisines
      .filter((c) => selectedCuisines.includes(c.id))
      .flatMap((c) => c.dishes);
  }, [selectedCuisines]);

  // Generate random dishes when count changes or on shuffle
  const generateDishes = useCallback(
    (count: number) => {
      const pool = availableDishes();
      // Keep existing custom items
      const customItems = options.filter((o) => o.cuisine === 'Custom');
      const slotsForGenerated = Math.max(0, count - customItems.length);
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, slotsForGenerated);
      onOptionsChange([...shuffled, ...customItems]);
    },
    [availableDishes, options, onOptionsChange]
  );

  // Initialize dishes on mount
  useEffect(() => {
    if (options.length === 0) {
      generateDishes(dishCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountChange = (newCount: number) => {
    setDishCount(newCount);
    generateDishes(newCount);
  };

  const handleShuffle = () => {
    generateDishes(dishCount);
  };

  const handleRemove = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    onOptionsChange(updated);
    setDishCount(Math.max(2, updated.length));
  };

  const handleAddCustom = () => {
    const name = customInput.trim();
    if (!name || options.some((o) => o.name.toLowerCase() === name.toLowerCase())) return;
    const updated = [...options, { name, emoji: '✨', veg: true, cuisine: 'Custom' }];
    onOptionsChange(updated);
    setDishCount(updated.length);
    setCustomInput('');
  };

  // Drag-to-scroll handlers for the horizontal list
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0));
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const canSpin = options.length >= 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 700, margin: '0 auto', width: '100%' }}>
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
          🎚️ Step 2 of 3
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
          Set Up Your Wheel
        </h2>
        <p style={{ color: '#9c6b8a', fontSize: '0.92rem', maxWidth: 420, margin: '0 auto' }}>
          Choose how many dishes, shuffle, add your own, or remove ones you don&apos;t fancy!
        </p>
      </motion.div>

      {/* ── Count Slider ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(233,30,140,0.12)',
          borderRadius: 20,
          padding: '22px 24px',
          boxShadow: '0 4px 20px rgba(233,30,140,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#b07a9e', margin: 0 }}>
            🎯 Number of Options
          </h3>
          <div
            style={{
              background: 'linear-gradient(135deg,#ff6b9d,#e91e8c)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.1rem',
              width: 40,
              height: 40,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(233,30,140,0.35)',
            }}
          >
            {dishCount}
          </div>
        </div>

        {/* Slider */}
        <div style={{ position: 'relative', padding: '0 2px' }}>
          <input
            type="range"
            min={2}
            max={12}
            value={dishCount}
            onChange={(e) => handleCountChange(Number(e.target.value))}
            style={{
              width: '100%',
              height: 6,
              appearance: 'none',
              WebkitAppearance: 'none',
              background: `linear-gradient(to right, #e91e8c ${((dishCount - 2) / 10) * 100}%, #fce4ec ${((dishCount - 2) / 10) * 100}%)`,
              borderRadius: 100,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          {/* Tick marks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '0 2px' }}>
            {Array.from({ length: 11 }, (_, i) => i + 2).map((n) => (
              <span
                key={n}
                style={{
                  fontSize: '0.65rem',
                  color: n === dishCount ? '#e91e8c' : '#c8a0b8',
                  fontWeight: n === dishCount ? 800 : 500,
                  transition: 'all 0.2s',
                  width: 16,
                  textAlign: 'center',
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Dish Bar (Horizontal Scroll) ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(233,30,140,0.12)',
          borderRadius: 20,
          padding: '20px 20px 16px',
          boxShadow: '0 4px 20px rgba(233,30,140,0.08)',
        }}
      >
        {/* Section header with shuffle/randomise */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#b07a9e', margin: 0 }}>
            🍽️ Dishes on the Wheel ({options.length})
          </h3>
          <div style={{ display: 'flex', gap: 6 }}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleShuffle}
              title="Shuffle dishes"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '5px 12px',
                borderRadius: 100,
                border: 'none',
                background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(124,58,237,0.25)',
              }}
            >
              <Shuffle size={12} /> Shuffle
            </motion.button>
            {options.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => { onOptionsChange([]); setDishCount(2); }}
                title="Clear all"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(233,30,140,0.08)',
                  color: '#e91e8c',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Horizontal scroll container */}
        {options.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '28px 16px',
              color: '#b07a9e',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            <Sparkles size={24} style={{ margin: '0 auto 8px', color: '#e91e8c', opacity: 0.5 }} />
            No dishes yet — slide the count or type one below!
          </div>
        ) : (
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              padding: '4px 2px 10px',
              scrollBehavior: 'smooth',
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="dish-scroll-bar"
          >
            <AnimatePresence mode="popLayout">
              {options.map((dish, i) => (
                <motion.div
                  key={`${dish.name}-${i}`}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '14px 12px 10px',
                    borderRadius: 16,
                    background:
                      dish.cuisine === 'Custom'
                        ? 'linear-gradient(135deg,#fff0f6,#fce4ec)'
                        : 'rgba(233,30,140,0.04)',
                    border: `1.5px solid ${dish.cuisine === 'Custom' ? '#ffb3d1' : 'rgba(233,30,140,0.12)'}`,
                    minWidth: 100,
                    maxWidth: 110,
                    flexShrink: 0,
                    position: 'relative',
                    transition: 'border-color 0.2s',
                    userSelect: 'none',
                  }}
                >
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(i);
                    }}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'rgba(233,30,140,0.12)',
                      color: '#e91e8c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#e91e8c';
                      (e.currentTarget as HTMLElement).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(233,30,140,0.12)';
                      (e.currentTarget as HTMLElement).style.color = '#e91e8c';
                    }}
                  >
                    <X size={11} strokeWidth={3} />
                  </button>

                  {/* Emoji */}
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{dish.emoji}</span>

                  {/* Name */}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#2d1b2e',
                      textAlign: 'center',
                      lineHeight: 1.25,
                      maxWidth: 90,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {dish.name}
                  </span>

                  {/* Cuisine badge */}
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 100,
                      background: dish.cuisine === 'Custom' ? '#e91e8c' : 'rgba(233,30,140,0.08)',
                      color: dish.cuisine === 'Custom' ? '#fff' : '#b07a9e',
                    }}
                  >
                    {dish.cuisine}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* ── Manual Add ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(233,30,140,0.12)',
          borderRadius: 20,
          padding: '20px',
          boxShadow: '0 4px 20px rgba(233,30,140,0.08)',
        }}
      >
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#b07a9e', marginBottom: 12 }}>
          ✏️ Add Your Own Dish
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            placeholder="e.g. Maggi, Dosa, Pasta..."
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 14,
              border: '1.5px solid rgba(233,30,140,0.2)',
              background: '#fff',
              color: '#2d1b2e',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          <motion.button
            whileHover={customInput.trim() ? { scale: 1.06 } : {}}
            whileTap={customInput.trim() ? { scale: 0.94 } : {}}
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
            style={{
              padding: '11px 18px',
              borderRadius: 14,
              border: 'none',
              background: customInput.trim()
                ? 'linear-gradient(135deg,#ff6b9d,#e91e8c)'
                : '#fce4ec',
              color: customInput.trim() ? '#fff' : '#e91e8c',
              cursor: customInput.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontWeight: 700,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap' as const,
              boxShadow: customInput.trim() ? '0 4px 14px rgba(233,30,140,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Plus size={15} /> Add
          </motion.button>
        </div>
      </motion.div>

      {/* ── Footer with Back + Spin ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          position: 'sticky',
          bottom: 0,
          padding: '16px 0',
          background: 'linear-gradient(to top, rgba(255,248,251,0.98) 60%, rgba(255,248,251,0) 100%)',
          zIndex: 10,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          style={{
            padding: '14px 20px',
            borderRadius: 16,
            border: '1.5px solid rgba(233,30,140,0.2)',
            background: 'rgba(255,255,255,0.95)',
            color: '#e91e8c',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ArrowLeft size={16} /> Back
        </motion.button>

        <motion.button
          whileHover={canSpin ? { scale: 1.03, y: -2 } : {}}
          whileTap={canSpin ? { scale: 0.97 } : {}}
          onClick={canSpin ? onSpin : undefined}
          disabled={!canSpin}
          style={{
            flex: 1,
            padding: '16px 24px',
            borderRadius: 16,
            border: 'none',
            background: canSpin
              ? 'linear-gradient(135deg,#ff6b9d 0%,#e91e8c 50%,#c2185b 100%)'
              : '#fce4ec',
            color: canSpin ? '#fff' : '#e91e8c',
            fontSize: '1.05rem',
            fontWeight: 800,
            cursor: canSpin ? 'pointer' : 'not-allowed',
            boxShadow: canSpin ? '0 8px 28px rgba(233,30,140,0.4)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all 0.2s',
          }}
        >
          🎡 Let&apos;s Spin!
        </motion.button>
      </motion.div>

      {!canSpin && (
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#b07a9e', marginTop: -12 }}>
          Add at least 2 dishes to spin the wheel
        </p>
      )}

      {/* Hide scrollbar CSS */}
      <style>{`
        .dish-scroll-bar::-webkit-scrollbar { display: none; }
        .dish-scroll-bar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b9d, #e91e8c);
          border: 3px solid #fff;
          box-shadow: 0 2px 10px rgba(233,30,140,0.4);
          cursor: pointer;
          transition: transform 0.15s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b9d, #e91e8c);
          border: 3px solid #fff;
          box-shadow: 0 2px 10px rgba(233,30,140,0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
