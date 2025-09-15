import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E11D2A',
          black: '#0B0B0B',
          white: '#FFFFFF',
        },
      },
      boxShadow: {
        glow: '0 0 0 3px rgba(225, 29, 42, 0.3)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
