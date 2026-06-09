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
          50:  '#eeeeff',
          100: '#ccccff',
          200: '#9999ff',
          400: '#3333ff',
          600: '#0000FF',
          800: '#0000cc',
          900: '#000099',
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
