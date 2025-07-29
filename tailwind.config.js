/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./assets/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-surface': '#1E1E1E',
        'dark-panel': '#2A2A2A',
        'dark-border': '#3D3D3D',
        'card-matte': '#222222',
        'dark-text-primary': '#F0F0F0',
        'dark-text-secondary': '#9E9E9E',
        'brand-accent': '#00D1A6',
        'brand-accent-hover': '#00B894',
        
        // Legacy mapping for consistency
        'brand-dark': '#121212',
        'brand-card': '#222222',
        'brand-surface': '#1E1E1E',
        'brand-border': '#3D3D3D',
        'brand-light': '#F0F0F0',
        'brand-muted': '#9E9E9E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-20px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        toastIn: {
          'from': { transform: 'translateY(100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        toastOut: {
          'from': { transform: 'translateY(0)', opacity: '1' },
          'to': { transform: 'translateY(100%)', opacity: '0' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        'toast-in': 'toastIn 0.5s ease-out',
        'toast-out': 'toastOut 0.5s ease-in-out forwards'
      },
    },
  },
  plugins: [],
} 