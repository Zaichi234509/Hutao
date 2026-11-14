/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        15: '15',
        16: '16',
        17: '17',
      },
      colors: {
        obsidian: '#17151A',
        ink: '#0E0C11',
        crimson: '#8D2636',
        'dark-red': '#531B29',
        gold: '#D9AE69',
        'gold-bright': '#F0CE8F',
        ivory: '#E8DCC8',
        muted: '#A69A91',
      },
      fontFamily: {
        display: ['Cinzel', 'Cormorant Garamond', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
        widest3: '0.42em',
      },
      backgroundImage: {
        'gold-line': 'linear-gradient(90deg, transparent, rgba(217,174,105,.6), transparent)',
        'crimson-glow':
          'radial-gradient(circle at 50% 50%, rgba(141,38,54,.55), rgba(83,27,41,.18) 45%, transparent 70%)',
      },
      boxShadow: {
        'inner-gold': 'inset 0 0 0 1px rgba(217,174,105,.22)',
        pyro: '0 0 40px rgba(141,38,54,.45), 0 0 90px rgba(141,38,54,.2)',
        card: '0 30px 80px -30px rgba(0,0,0,.9)',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(0,-14px,0) rotate(3deg)' },
          '100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
        },
        flicker: {
          '0%,100%': { opacity: '.55' },
          '45%': { opacity: '.9' },
          '60%': { opacity: '.62' },
        },
        'scroll-dot': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateY(18px)', opacity: '0' },
        },
      },
      animation: {
        drift: 'drift 9s ease-in-out infinite',
        flicker: 'flicker 6s ease-in-out infinite',
        'scroll-dot': 'scroll-dot 2.2s cubic-bezier(.65,0,.35,1) infinite',
      },
    },
  },
  plugins: [],
}
