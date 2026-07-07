'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { spinCuisines } from '@/data/spinData';

interface CuisineSelectProps {
  selectedCuisines: string[];
  onToggleCuisine: (id: string) => void;
  onNext: () => void;
}

export default function CuisineSelect({ selectedCuisines, onToggleCuisine, onNext }: CuisineSelectProps) {
  const allSelected = selectedCuisines.length === spinCuisines.length;

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      selectedCuisines.forEach((id) => onToggleCuisine(id));
    } else {
      // Select all missing
      spinCuisines.forEach((c) => {
        if (!selectedCuisines.includes(c.id)) onToggleCuisine(c.id);
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700, margin: '0 auto', width: '100%' }}>
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
          🍛 Step 1 of 3
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
          What are you craving?
        </h2>
        <p style={{ color: '#9c6b8a', fontSize: '0.92rem', maxWidth: 400, margin: '0 auto' }}>
          Pick one or more cuisines and we&apos;ll load up the wheel with delicious options!
        </p>
      </motion.div>

      {/* Select All toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 4px' }}
      >
        <button
          onClick={handleSelectAll}
          style={{
            padding: '6px 16px',
            borderRadius: 100,
            border: '1.5px solid rgba(233,30,140,0.2)',
            background: allSelected ? 'linear-gradient(135deg,#ff6b9d,#e91e8c)' : 'rgba(255,255,255,0.9)',
            color: allSelected ? '#fff' : '#e91e8c',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: allSelected ? '0 3px 12px rgba(233,30,140,0.3)' : 'none',
          }}
        >
          {allSelected ? '✓ All Selected' : '🌍 Select All'}
        </button>
      </motion.div>

      {/* Cuisine Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}
        className="cuisine-select-grid"
      >
        {spinCuisines.map((cuisine, i) => {
          const isSelected = selectedCuisines.includes(cuisine.id);
          return (
            <motion.button
              key={cuisine.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggleCuisine(cuisine.id)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '22px 12px 18px',
                borderRadius: 20,
                border: isSelected
                  ? '2px solid #e91e8c'
                  : '1.5px solid rgba(233,30,140,0.12)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(255,107,157,0.15), rgba(255,179,71,0.10))'
                  : 'rgba(255,255,255,0.92)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: isSelected
                  ? '0 0 0 3px rgba(233,30,140,0.15), 0 8px 28px rgba(233,30,140,0.15)'
                  : '0 4px 16px rgba(233,30,140,0.06)',
                textAlign: 'center',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#ff6b9d,#e91e8c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(233,30,140,0.4)',
                  }}
                >
                  <Check size={12} color="#fff" strokeWidth={3} />
                </motion.div>
              )}

              {/* Emoji */}
              <span style={{ fontSize: '2.4rem', lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))' }}>
                {cuisine.emoji}
              </span>

              {/* Name */}
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#e91e8c' : '#2d1b2e' }}>
                {cuisine.label}
              </span>

              {/* Dish count */}
              <span style={{ fontSize: '0.7rem', color: '#b07a9e', fontWeight: 500 }}>
                {cuisine.dishes.length} dishes
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: 'linear-gradient(to top, rgba(255,248,251,0.98) 60%, rgba(255,248,251,0) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: '0.85rem', color: '#9c6b8a', fontWeight: 600 }}>
          <span style={{ color: '#e91e8c', fontWeight: 800 }}>{selectedCuisines.length}</span>{' '}
          cuisine{selectedCuisines.length !== 1 ? 's' : ''} selected
        </span>

        <motion.button
          whileHover={selectedCuisines.length > 0 ? { scale: 1.04, y: -2 } : {}}
          whileTap={selectedCuisines.length > 0 ? { scale: 0.97 } : {}}
          onClick={selectedCuisines.length > 0 ? onNext : undefined}
          disabled={selectedCuisines.length === 0}
          style={{
            padding: '14px 32px',
            borderRadius: 16,
            border: 'none',
            background:
              selectedCuisines.length > 0
                ? 'linear-gradient(135deg,#ff6b9d 0%,#e91e8c 50%,#c2185b 100%)'
                : '#fce4ec',
            color: selectedCuisines.length > 0 ? '#fff' : '#e91e8c',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: selectedCuisines.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selectedCuisines.length > 0 ? '0 6px 24px rgba(233,30,140,0.35)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s',
          }}
        >
          Next — Choose Dishes →
        </motion.button>
      </motion.div>

      {/* Responsive grid: 2 cols on mobile */}
      <style>{`
        @media (max-width: 600px) {
          .cuisine-select-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
