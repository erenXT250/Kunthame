/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      colors: {
        romantic: {
          darkest: '#080312',
          dark: '#120722',
          deep: '#1a0b33',
          surface: 'rgba(30, 14, 56, 0.45)',
          pink: '#ff7597',
          rose: '#f43f5e',
          gold: '#f59e0b',
          amber: '#fbbf24',
          glow: 'rgba(255, 117, 151, 0.35)',
        }
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'glow-breathe': 'glowBreathe 4s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowBreathe: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(255, 117, 151, 0.3))' },
          '50%': { filter: 'drop-shadow(0 0 30px rgba(255, 117, 151, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}
