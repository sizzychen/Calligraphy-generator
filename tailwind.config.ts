import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        'chinese': ['SimSun', 'Microsoft YaHei', 'serif'],
        'stroke': ['KaiTi', 'SimSun', 'serif'],
      },
      fontSize: {
        'grid': '2rem',
        'grid-large': '3rem',
      }
    },
  },
  plugins: [],
}
export default config