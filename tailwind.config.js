/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070707',
          900: '#0a0a0a',
          850: '#0d0d0d',
          800: '#141414',
          700: '#1d1d1d',
        },
        crimson: {
          DEFAULT: '#d90f1f',
          bright: '#ff2133',
          deep: '#8c0712',
        },
        bone: {
          DEFAULT: '#f4f1ec',
          dim: '#a8a5a0',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Manrope', 'Arial', 'sans-serif'],
        script: ['"Mrs Saint Delafield"', 'cursive'],
      },
      letterSpacing: {
        editorial: '0.22em',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      keyframes: {
        emberFloat: {
          '0%,100%': { transform: 'translate3d(0,0,0)', opacity: '0.25' },
          '50%': { transform: 'translate3d(0,-26px,0)', opacity: '0.8' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        curtain: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-100%)' },
        },
      },
      animation: {
        'ember-float': 'emberFloat 7s ease-in-out infinite',
        'spin-slow': 'spinSlow 26s linear infinite',
        curtain: 'curtain 0.9s cubic-bezier(0.19,1,0.22,1) forwards',
      },
    },
  },
  plugins: [],
}
