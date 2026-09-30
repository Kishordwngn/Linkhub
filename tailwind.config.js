/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B1F3B',
          deep: '#111428',
          raised: '#23294D',
        },
        accent: {
          DEFAULT: '#2F7DF6',
          deep: '#1E5FD9',
          soft: '#8CB8FF',
        },
        page: '#FAFAF7',
        warm: '#F3F2EC',
        ink2: '#3F4260',
        line: '#E6E4DD',
      },
      fontFamily: {
        display: ['"Necto Mono"', '"JetBrains Mono"', 'monospace'],
        sans: ['"Necto Mono"', '"JetBrains Mono"', 'monospace'],
        mono: ['"Necto Mono"', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass-3d':
          '0 20px 40px -15px rgba(27, 31, 59, 0.14), 0 1px 2px rgba(27, 31, 59, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
        'glass-card':
          '0 24px 48px -20px rgba(27, 31, 59, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
        'stage-phone':
          '0 50px 100px -30px rgba(17, 20, 40, 0.45), 0 0 0 2px rgba(255, 255, 255, 0.15) inset',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
