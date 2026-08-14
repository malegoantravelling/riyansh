/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#5B8C51',
          hover: '#4E7A46',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F6F0E2',
          foreground: '#1A1A1A',
        },
        accent: {
          DEFAULT: '#7BA672',
          foreground: '#FFFFFF',
        },
        ayurveda: {
          green: '#5B8C51',
          'green-dark': '#4E7A46',
          'green-darker': '#3D5D36',
          'green-light': '#7BA672',
          cream: '#F6F0E2',
          'cream-light': '#FAFAF2',
          black: '#1A1A1A',
          gray: '#737373',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
