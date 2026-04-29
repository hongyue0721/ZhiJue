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
        'notion-bg': '#191919',
        'notion-surface': '#202020',
        'notion-hover': '#2a2a2a',
        'notion-border': 'rgba(255,255,255,0.06)',
        'notion-text': '#EBEBEB',
        'notion-text-secondary': '#9B9B9B',
        'notion-text-tertiary': '#6B6B6B',
        'notion-accent': '#E8C99A',
        'notion-blue': '#529CCA',
        'notion-red': '#E06C75',
        'notion-green': '#98C379',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        serif: [
          'Georgia',
          '"Noto Serif SC"',
          '"Songti SC"',
          'serif',
        ],
      },
      fontSize: {
        'notion-xs': ['12px', { lineHeight: '1.6' }],
        'notion-sm': ['14px', { lineHeight: '1.6' }],
        'notion-base': ['16px', { lineHeight: '1.7' }],
        'notion-lg': ['18px', { lineHeight: '1.6' }],
        'notion-xl': ['20px', { lineHeight: '1.4' }],
        'notion-2xl': ['24px', { lineHeight: '1.3' }],
        'notion-3xl': ['32px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'notion': '4px',
        'notion-md': '6px',
        'notion-lg': '8px',
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0,0,0,0.3)',
        'notion-lg': '0 4px 12px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
