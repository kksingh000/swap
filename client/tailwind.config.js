/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Overriding Tailwind's `red`/`gray` scales on purpose — the palette is
        // black/white/red/gray ONLY, so default color scales must not be reachable.
        black: { DEFAULT: '#0A0A0A', deep: '#050505' },
        charcoal: '#161616',
        red: { DEFAULT: '#A6192E', light: '#D33F52', deep: '#6E1120' },
        ivory: '#F5F3EF',
        gray: { light: '#D8D6D2', mid: '#8A8A85', dark: '#2B2B2B', line: '#333333' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.2em',
      },
      boxShadow: {
        // Two-layer depth system: ambient float + tight contact + top edge-light.
        material:
          '0 24px 70px -20px rgba(0,0,0,0.6), 0 2px 10px -2px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.06)',
        'material-lg':
          '0 40px 120px -28px rgba(0,0,0,0.8), 0 4px 18px -4px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.07)',
        'material-sm':
          '0 12px 36px -14px rgba(0,0,0,0.55), 0 1px 6px -1px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.05)',
        glow: '0 0 28px 0 rgba(166,25,46,0.4)',
        'glow-strong': '0 0 36px -4px rgba(166,25,46,0.6), 0 0 12px -2px rgba(166,25,46,0.4)',
        'glow-soft': '0 0 48px -12px rgba(166,25,46,0.35)',
        'cta-rest': '0 12px 32px -10px rgba(166,25,46,0.45)',
      },
      keyframes: {
        'blob-drift': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(42px, -48px) scale(1.08)' },
          '66%': { transform: 'translate(-34px, 30px) scale(0.94)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
      animation: {
        'blob-drift': 'blob-drift 18s ease-in-out infinite',
        'blob-drift-slow': 'blob-drift 26s ease-in-out infinite reverse',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        typing: 'typing-dot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
