/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primaryStart: '#FF6B9D', // soft pink start
        primaryMid: '#FF8C69',
        primaryEnd: '#FFB347',
        backgroundLight: '#FFF0F5',
        backgroundDark: '#1A0A0F',
        cardLight: 'rgba(255,255,255,0.85)',
        cardDark: 'rgba(30,30,30,0.85)',
        accent: '#E91E8C',
        textBase: '#2D1B2E',
      },
      borderRadius: {
        card: '16px',
        hero: '24px',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        hindi: ['"Hind Devanagari"', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
