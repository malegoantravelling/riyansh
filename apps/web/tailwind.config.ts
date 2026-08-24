import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        cotton: { DEFAULT: '#ffffff', deep: '#f7f7f7' },
        jade: { DEFAULT: 'var(--color-jade)', mist: 'var(--sage-mist)' },
        'dusty-olive': 'var(--color-dusty-olive)',
        evergreen: {
          DEFAULT: 'var(--color-evergreen)',
          mid: 'var(--forest-mid)',
          deep: 'var(--forest-deep)',
        },
        primary: {
          DEFAULT: 'var(--color-evergreen)',
          hover: 'var(--forest-deep)',
          foreground: '#FFFFFF',
          soft: 'var(--color-dusty-olive)',
        },
        secondary: {
          DEFAULT: '#F7F7F7',
          foreground: 'var(--color-evergreen)',
        },
        forest: {
          DEFAULT: 'var(--color-evergreen)',
          mid: 'var(--forest-mid)',
          deep: 'var(--forest-deep)',
          soft: 'var(--color-dusty-olive)',
        },
        ivory: { DEFAULT: '#ffffff', deep: '#f7f7f7' },
        charcoal: 'var(--color-evergreen)',
        stone: { DEFAULT: 'var(--color-dusty-olive)' },
        sage: { DEFAULT: 'var(--color-jade)', mist: 'var(--sage-mist)' },
        brass: { DEFAULT: 'var(--color-dusty-olive)', soft: 'var(--color-jade)' },
        ayurveda: {
          green: 'var(--color-evergreen)',
          'green-dark': 'var(--forest-deep)',
          cream: '#ffffff',
          'cream-light': '#ffffff',
          yellow: '#f7f7f7',
          black: 'var(--color-evergreen)',
          gray: 'var(--color-dusty-olive)',
          muted: 'var(--color-dusty-olive)',
        },
        accent: {
          DEFAULT: 'var(--color-jade)',
          foreground: 'var(--color-evergreen)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionTimingFunction: {
        premium: 'var(--ease-premium)',
        smooth: 'var(--ease-smooth)',
      },
      boxShadow: {
        soft: 'var(--shadow-md)',
        glass: 'var(--shadow-glass)',
        lift: 'var(--shadow-lg)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
