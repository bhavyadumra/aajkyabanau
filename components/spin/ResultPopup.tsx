'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { SpinDish } from '@/data/spinData';

interface ResultPopupProps {
  dish: SpinDish | null;
  onClose: () => void;
}

export default function ResultPopup({ dish, onClose }: ResultPopupProps) {
  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(45,27,46,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 28,
              padding: '40px 36px',
              textAlign: 'center',
              maxWidth: 360,
              width: '100%',
              boxShadow: '0 25px 80px rgba(233,30,140,0.25), 0 0 0 1px rgba(233,30,140,0.1)',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: '#fce4ec',
                color: '#e91e8c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>

            {/* Title */}
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#b07a9e',
              marginBottom: 16,
            }}>
              🎡 Aaj Kya Banau?
            </div>

            {/* Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.15 }}
              style={{ fontSize: '5rem', lineHeight: 1, marginBottom: 20 }}
            >
              {dish.emoji}
            </motion.div>

            {/* Dish name */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg,#e91e8c,#ff6b9d,#ff8c69)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              {dish.name}
            </motion.h2>

            {/* Cuisine & veg badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}
            >
              <span style={{
                padding: '4px 12px',
                borderRadius: 100,
                fontSize: '0.75rem',
                fontWeight: 600,
                background: '#fff0f6',
                color: '#e91e8c',
                border: '1px solid #ffb3d1',
              }}>
                {dish.cuisine}
              </span>
              <span style={{
                padding: '4px 12px',
                borderRadius: 100,
                fontSize: '0.75rem',
                fontWeight: 600,
                background: dish.veg ? '#f0fdf4' : '#fff1f2',
                color: dish.veg ? '#16a34a' : '#e11d48',
                border: `1px solid ${dish.veg ? '#bbf7d0' : '#fecdd3'}`,
              }}>
                {dish.veg ? '🌿 Veg' : '🍖 Non-Veg'}
              </span>
            </motion.div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg,#ff6b9d,#e91e8c)',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(233,30,140,0.35)',
                letterSpacing: '-0.01em',
              }}
            >
              Yummy! 🎉 Spin Again
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
