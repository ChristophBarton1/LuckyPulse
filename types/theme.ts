// Sport / esport visual themes. Applied via `data-theme` on a wrapper element to swap
// the `--lp-accent*` tokens (see assets/scss/tokens.scss).

export type SportTheme =
  | 'default'
  | 'football'
  | 'f1'
  | 'tennis'
  | 'basketball'
  | 'fight'
  | 'esports'

export const SPORT_THEMES: readonly SportTheme[] = [
  'default',
  'football',
  'f1',
  'tennis',
  'basketball',
  'fight',
  'esports',
] as const

export const SPORT_THEME_LABELS: Record<SportTheme, string> = {
  default: 'Default',
  football: 'Football',
  f1: 'Formula 1',
  tennis: 'Tennis',
  basketball: 'Basketball',
  fight: 'Fight Sports',
  esports: 'Esports',
}
