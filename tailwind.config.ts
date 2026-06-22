import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAFAF5',
        'gray-blue': '#F0F4F8',
        mint: '#A8D8B9',
        sky: '#89CFF0',
        peach: '#FFDAB9',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
