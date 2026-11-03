import type { Config } from 'tailwindcss';

/**
 * Pixy design tokens: warm paper, ink text, one tomato accent. Flat colour,
 * no gradients or glow; photos supply the colour. The live wall is the one
 * dark surface (ink background).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        card: '#FFFFFF',
        rule: '#E8E2D9',
        field: '#D6CEC2',
        ink: {
          DEFAULT: '#1A1714',
          soft: '#4A433C',
          line: '#332D27',
        },
        muted: {
          DEFAULT: '#6B635A',
          light: '#BDB3A7',
        },
        // Dark enough that white text on it passes 4.5:1.
        accent: {
          DEFAULT: '#C93A22',
          hover: '#A12C18',
          soft: '#F2B8A8',
          live: '#E5482E',
        },
        placeholder: '#D9CBB8',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        // A printed photo lying on paper.
        print: '0 1px 2px rgba(26,23,20,0.08), 0 12px 28px -10px rgba(26,23,20,0.35)',
        lift: '0 2px 4px rgba(26,23,20,0.06), 0 22px 40px -14px rgba(26,23,20,0.4)',
      },
      keyframes: {
        drift: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--tilt, 0deg))' },
          '50%': { transform: 'translateY(-10px) rotate(var(--tilt, 0deg))' },
        },
        rise: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'none' } },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.85) rotate(-2deg)' },
          '70%': { opacity: '1', transform: 'scale(1.03) rotate(0.5deg)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        drop: {
          '0%': { opacity: '0', transform: 'translateY(-40px) scale(1.08) rotate(var(--tilt, -3deg))' },
          '100%': { opacity: '1', transform: 'rotate(var(--tilt, 0deg))' },
        },
        develop: {
          from: { filter: 'blur(12px) saturate(0.2) brightness(1.4)', opacity: '0.4' },
          to: { filter: 'none', opacity: '1' },
        },
        flash: { '0%': { opacity: '0.95' }, '100%': { opacity: '0' } },
        kenburns: {
          from: { transform: 'scale(1.02) translate(0, 0)' },
          to: { transform: 'scale(1.12) translate(-2%, -1.5%)' },
        },
        confetti: {
          '0%': { transform: 'translate3d(0, -10vh, 0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate3d(var(--dx, 0), 105vh, 0) rotate(var(--spin, 540deg))', opacity: '0.9' },
        },
        ping2: { '0%': { transform: 'scale(1)', opacity: '0.5' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
      },
      animation: {
        drift: 'drift 60s linear infinite',
        float: 'float 7s ease-in-out infinite',
        rise: 'rise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        pop: 'pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        drop: 'drop 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        develop: 'develop 1.6s ease-out both',
        flash: 'flash 0.45s ease-out both',
        kenburns: 'kenburns 18s ease-in-out infinite alternate',
        confetti: 'confetti var(--dur, 3s) cubic-bezier(0.3, 0.6, 0.5, 1) var(--delay, 0s) both',
        ping2: 'ping2 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
