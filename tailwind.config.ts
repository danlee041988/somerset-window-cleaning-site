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
          black: '#0A0B0D',
          white: '#F5F7FA',
          gold: '#F4C542',
          green: '#16A34A',
        },
        glass: 'rgba(255,255,255,0.06)',
        'glass-border': 'rgba(255,255,255,0.14)',
        'noir-muted': 'rgba(245,247,250,0.72)',
        'noir-subtle': 'rgba(245,247,250,0.55)',
      },
      boxShadow: {
        glow: '0 0 0 3px rgba(225, 29, 42, 0.3)',
        'noir-panel': 'inset 0 1px 0 rgba(255,255,255,0.06), 0 36px 68px -40px rgba(0,0,0,0.65)',
        'noir-card': 'inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 46px -32px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(800px circle at 20% -10%, rgba(225,29,42,0.18), transparent 45%), radial-gradient(1000px circle at 110% 0%, rgba(225,29,42,0.12), transparent 48%)',
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
