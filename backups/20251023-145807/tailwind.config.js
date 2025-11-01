/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Professional Green Palette from Reference
        'gn-primary': {
          50: '#DAFDE2',      // lightest green
          100: '#8CB69B',     // light green
          200: '#235347',     // medium green
          300: '#163832',     // darker green
          400: '#0B2B26',     // dark green
          500: '#051F20',     // darkest green
          600: '#16a34a',     // primary green
          700: '#15803d',     // primary green dark
          800: '#166534',     // primary green darker
          900: '#14532d',     // darkest primary green
        },
        'gn-accent': {
          50: '#f9fafb',      // lightest gray
          100: '#F8FFFE',     // background light
          200: '#E8F5F0',     // soft background
          300: '#D1E7DD',     // accent light
          400: '#8CB69B',     // accent medium
          500: '#68A082',     // accent dark
          600: '#4b5563',     // accent darker
          700: '#374151',     // accent very dark
          800: '#1f2937',     // accent darkest
          900: '#111827',     // accent black
        },
        'gn-gold': {
          400: '#D4AF37',     // gold
          500: '#B8941F',     // gold-hover
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',      // text-muted
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Ubuntu', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.05s ease-in-out',
        'slide-up': 'slideUp 0.05s ease-out',
        'bounce-light': 'bounce 0.2s infinite',
        'pulse-slow': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 1s ease-in-out infinite',
        'glow': 'glow 0.3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      borderRadius: {
        // Material Design 3 Border Radius Tokens
        'xs': '0.25rem', // 4px - Extra small
        'sm': '0.5rem',  // 8px - Small  
        'md': '0.75rem', // 12px - Medium
        'lg': '1rem',    // 16px - Large
        'xl': '1.5rem',  // 24px - Extra large
        '2xl': '2rem',   // 32px - Extra extra large
        '3xl': '2.5rem', // 40px - Premium rounded
        'full': '9999px', // Circular
        
        // Material Design 3 Semantic Tokens
        'container-xs': '0.5rem',  // 8px - Small containers
        'container-sm': '0.75rem', // 12px - Medium containers  
        'container-md': '1rem',    // 16px - Large containers
        'container-lg': '1.5rem',  // 24px - Premium containers
        'button': '1.25rem',       // 20px - Button radius
        'card': '1rem',           // 16px - Card radius
        'input': '0.75rem',       // 12px - Input fields
        'dialog': '1.75rem',      // 28px - Modal/Dialog
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}