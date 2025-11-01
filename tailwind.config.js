/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}"
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': 'rgb(var(--background-primary) / <alpha-value>)',
        'background-secondary': 'rgb(var(--background-secondary) / <alpha-value>)',
        'background-elevated': 'rgb(var(--background-elevated) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',
        'tint-color': 'rgb(var(--tint-color) / <alpha-value>)',
        'separator-color': 'rgb(var(--separator-color) / <alpha-value>)',
        'success': 'rgb(var(--success-color) / <alpha-value>)',
        'error': 'rgb(var(--error-color) / <alpha-value>)',
        'warning': 'rgb(var(--warning-color) / <alpha-value>)',
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