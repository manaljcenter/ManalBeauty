/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF69B4',
        secondary: '#FFB6C1',
        accent: '#FF1493',
        foreground: '#171717',
      },
      fontFamily: {
        almarai: ['var(--font-almarai)', 'CustomArabicFont', 'sans-serif'],
        'custom-arabic': ['CustomArabicFont', 'var(--font-almarai)', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
      },
      animation: {
        'slow-zoom': 'slowZoom 10s ease-in-out infinite',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}; 