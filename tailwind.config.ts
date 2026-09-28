import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        coral: '#FF4D4D',
        ink: '#050505',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'var(--font-deva)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-heading)', 'var(--font-deva)', 'Georgia', 'serif'],
        heading: ['var(--font-heading)', 'var(--font-deva)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
