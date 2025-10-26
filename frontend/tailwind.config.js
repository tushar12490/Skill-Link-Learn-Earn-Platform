/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        night: '#0F172A', // Custom dark background color
        slate: require('tailwindcss/colors').slate, // Ensure slate is available
        // Primary brand color - Teal
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6', // DEFAULT
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          DEFAULT: '#14B8A6',
          light: '#2DD4BF',
          dark: '#0F766E',
        },
        // Accent color - Amber
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // DEFAULT
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        // Neutral grays for backgrounds and text
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          DEFAULT: '#1E293B',
          light: '#F8FAFC',
          dark: '#0F172A',
        }
      },
      boxShadow: {
        glass: '0 12px 30px -12px rgba(30, 30, 30, 0.35)',
        'teal-glow': '0 0 8px #14B8A6',
        'amber-glow': '0 0 8px #F59E0B',
        teal: '0 8px 24px rgba(20, 184, 166, 0.25)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(20,184,166,0.15), transparent 60%), radial-gradient(circle at top right, rgba(245,158,11,0.08), transparent 55%)'
      }
    }
  },
  plugins: []
};
