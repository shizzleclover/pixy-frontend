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
    },
  },
  plugins: [],
};

export default config;
