/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
      },
      colors: {
        brand: {
          50:  '#fdf2f2',
          100: '#f9d5d5',
          200: '#f0a0a0',
          400: '#c0392b',
          600: '#8B1A1A',
          800: '#5c0f0f',
          900: '#3b0a0a',
        },
        ink: {
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#cccccc',
          400: '#888888',
          600: '#444444',
          800: '#1a1a1a',
          900: '#0a0a0a',
        }
      },
    },
  },
  plugins: [],
}