/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0b0b0d',
          surface: '#141418',
          elevated: '#1c1c22',
          border: '#26262d',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#fbbf24',
          muted: '#78350f',
        },
        text: {
          primary: '#f5f5f7',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245,158,11,0.4), 0 8px 30px rgba(245,158,11,0.15)',
      },
    },
  },
  plugins: [],
};
