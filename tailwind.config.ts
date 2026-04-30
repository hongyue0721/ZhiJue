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
        'notion-bg': '#FFFCF7',
        'notion-surface': '#FFFFFF',
        'notion-hover': '#F5F0E8',
        'notion-border': 'rgba(15, 15, 15, 0.06)',
        'notion-border-focus': 'rgba(15, 15, 15, 0.16)',
        'notion-text': '#37352F',
        'notion-text-secondary': '#787774',
        'notion-text-tertiary': '#B4B4B0',
        'notion-accent': '#D4A853',
        'notion-blue': '#2EAADC',
        'notion-red': '#E06C75',
        'notion-green': '#4DAB9A',
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
        'notion': '0 1px 3px rgba(0,0,0,0.06)',
        'notion-lg': '0 4px 12px rgba(0,0,0,0.08)',
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
