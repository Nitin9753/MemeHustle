 /** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'neon-pink': '#ff00ff',
          'neon-blue': '#00ffff',
          'neon-purple': '#9900ff',
          'cyber-black': '#0d0d0d',
          'cyber-gray': '#1a1a1a',
        },
        animation: {
          'glitch': 'glitch 1s infinite',
          'flicker': 'flicker 2s infinite',
          'pulse-glow': 'pulseGlow 2s infinite',
        },
        keyframes: {
          glitch: {
            '0%, 100%': { transform: 'translate(0)' },
            '20%': { transform: 'translate(-2px, 2px)' },
            '40%': { transform: 'translate(-2px, -2px)' },
            '60%': { transform: 'translate(2px, 2px)' },
            '80%': { transform: 'translate(2px, -2px)' },
          },
          flicker: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.8' },
          },
          pulseGlow: {
            '0%, 100%': { boxShadow: '0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff' },
            '50%': { boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff' },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/aspect-ratio'),
    ],
  }