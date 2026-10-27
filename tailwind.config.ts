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
        brand: {
          50: '#FFF1F6',
          100: '#FFE4ED',
          200: '#FFC9DB',
          300: '#FF9EC1',
          400: '#FF6BA1',
          500: '#F83D80',
          600: '#E51D67',
          700: '#C11254',
          800: '#9D1146',
          900: '#82133F',
          950: '#4A0320',
        },
        iris: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        sun: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        ink: {
          600: '#33334D',
          700: '#22223A',
          800: '#171727',
          850: '#12121F',
          900: '#0D0D18',
          950: '#08080F',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #F83D80 0%, #8B5CF6 55%, #F59E0B 115%)',
        'brand-gradient-soft':
          'linear-gradient(120deg, rgba(248,61,128,0.16) 0%, rgba(139,92,246,0.16) 55%, rgba(245,158,11,0.16) 115%)',
        'sheen': 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.14) 45%, transparent 70%)',
      },
      boxShadow: {
        glow: '0 14px 44px -14px rgba(248,61,128,0.65)',
        'glow-violet': '0 14px 44px -14px rgba(139,92,246,0.6)',
        card: '0 24px 60px -32px rgba(0,0,0,0.85)',
        'inner-line': 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        panGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        },
        ringPulse: {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'pan-gradient': 'panGradient 8s ease infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'ring-pulse': 'ringPulse 2.4s ease-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
