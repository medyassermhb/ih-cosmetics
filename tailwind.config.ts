import type { Config } from 'tailwindcss'

const config: Config = {
  // === THIS IS THE PART TO REPLACE ===
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ===================================
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        // This is the palette we defined earlier
        'beige-100': '#F5F5DC', 
        'yellow-600': '#DAA520',
        'yellow-700': '#B8860B',
        'yellow-800': '#8B4513',
      },
    },
  },
  plugins: [],
}
export default config