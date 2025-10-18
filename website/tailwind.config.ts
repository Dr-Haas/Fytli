import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        fytli: {
          yellow: '#FFD56B',
          orange: '#FFA34A',
          red: '#FF7948',
          dark: '#4A2E20',
          cream: '#FFF5E6',
          light: '#FFF8EE',
        },
      },
    },
  },
  plugins: [],
};

export default config;

