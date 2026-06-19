import type { Config } from 'tailwindcss'

// Tailwind theme is mapped onto CSS custom properties (see assets/scss/tokens.scss),
// so utilities like `bg-lp-surface` / `text-lp-gold` resolve to the live token value.
// `lp-accent*` tokens are swapped per sport/esport theme via the `data-theme` attribute,
// which means a single set of components re-skins itself without conditional classes.
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'lp-bg': 'var(--lp-bg)',
        'lp-bg-soft': 'var(--lp-bg-soft)',
        'lp-surface': 'var(--lp-surface)',
        'lp-surface-2': 'var(--lp-surface-2)',
        'lp-surface-3': 'var(--lp-surface-3)',
        'lp-border': 'var(--lp-border)',
        'lp-border-strong': 'var(--lp-border-strong)',
        'lp-gold': 'var(--lp-gold)',
        'lp-gold-strong': 'var(--lp-gold-strong)',
        'lp-purple': 'var(--lp-purple)',
        'lp-purple-strong': 'var(--lp-purple-strong)',
        'lp-cyan': 'var(--lp-cyan)',
        'lp-blue': 'var(--lp-blue)',
        'lp-green': 'var(--lp-green)',
        'lp-orange': 'var(--lp-orange)',
        'lp-red': 'var(--lp-red)',
        'lp-red-strong': 'var(--lp-red-strong)',
        'lp-text': 'var(--lp-text)',
        'lp-text-muted': 'var(--lp-text-muted)',
        'lp-text-soft': 'var(--lp-text-soft)',
        // Theme-reactive accents.
        'lp-accent': 'var(--lp-accent)',
        'lp-accent-strong': 'var(--lp-accent-strong)',
        'lp-accent-2': 'var(--lp-accent-2)',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        'lp-sm': '8px',
        'lp-md': '12px',
        'lp-lg': '16px',
        'lp-xl': '22px',
        'lp-2xl': '28px',
      },
      boxShadow: {
        'lp-card': 'var(--lp-shadow-card)',
        'glow-gold': 'var(--lp-glow-gold)',
        'glow-red': 'var(--lp-glow-red)',
        'glow-purple': 'var(--lp-glow-purple)',
        'glow-cyan': 'var(--lp-glow-cyan)',
        'glow-accent': 'var(--lp-glow-accent)',
      },
      backgroundImage: {
        'lp-gold-gradient': 'linear-gradient(135deg, var(--lp-gold-strong), var(--lp-gold))',
        'lp-red-gradient': 'linear-gradient(135deg, var(--lp-red-strong), var(--lp-red))',
        'lp-accent-gradient': 'linear-gradient(135deg, var(--lp-accent-strong), var(--lp-accent-2))',
        'lp-surface-gradient': 'linear-gradient(180deg, var(--lp-surface-2), var(--lp-surface))',
      },
      keyframes: {
        'lp-live': {
          '0%': { boxShadow: '0 0 0 0 rgba(251,84,113,0.55)' },
          '70%': { boxShadow: '0 0 0 7px rgba(251,84,113,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(251,84,113,0)' },
        },
        'lp-fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'lp-live': 'lp-live 1.8s ease-out infinite',
        'lp-fade-in': 'lp-fade-in 0.25s ease-out',
      },
    },
  },
}
