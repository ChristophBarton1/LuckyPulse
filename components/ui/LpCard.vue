<script setup lang="ts">
/**
 * LpCard — premium surface container, the base of most UI.
 *
 * Follows the LpButton house pattern:
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive variant/padding/glow class maps (plain objects)
 *  - `cn()` to compose, no external UI lib
 *  - renders as <NuxtLink> when `to` is supplied (focusable natively),
 *    otherwise the `as` tag (default <div>); interactive non-links get
 *    tabindex + role + a visible focus ring.
 *  - optional `header` / `footer` slots rendered with a divider border.
 */
import { computed } from 'vue'
import { NuxtLink } from '#components'
import { cn } from '~/utils/cn'

type Variant = 'surface' | 'elevated' | 'outline' | 'gradient'
type Padding = 'none' | 'sm' | 'md' | 'lg'
type Glow = 'none' | 'gold' | 'purple' | 'cyan' | 'accent'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    padding?: Padding
    /** Hover lift + cursor-pointer + focus ring; makes non-link cards focusable. */
    interactive?: boolean
    glow?: Glow
    /** Adds the lp-card-sheen top highlight. */
    sheen?: boolean
    /** When set, renders a NuxtLink to this destination. */
    to?: string
    /** Tag name to render when not a link. */
    as?: string
    /** Accessible label, useful when the whole card is interactive. */
    ariaLabel?: string
  }>(),
  {
    variant: 'surface',
    padding: 'md',
    interactive: false,
    glow: 'none',
    sheen: false,
    to: undefined,
    as: 'div',
    ariaLabel: undefined,
  },
)

defineEmits<{ click: [event: MouseEvent] }>()

const VARIANTS: Record<Variant, string> = {
  surface: 'bg-lp-surface',
  elevated: 'bg-lp-surface-gradient shadow-lp-card',
  outline: 'bg-transparent',
  gradient: 'bg-lp-surface-gradient',
}

const PADDINGS: Record<Padding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

const GLOWS: Record<Glow, string> = {
  none: '',
  gold: 'shadow-glow-gold',
  purple: 'shadow-glow-purple',
  cyan: 'shadow-glow-cyan',
  accent: 'shadow-glow-accent',
}

const isLink = computed(() => props.to !== undefined)

/** Non-link interactive cards need explicit keyboard semantics. */
const isFocusableNonLink = computed(() => props.interactive && !isLink.value)

const rootClasses = computed(() =>
  cn(
    'relative font-body rounded-lp-xl border border-lp-border',
    VARIANTS[props.variant],
    GLOWS[props.glow],
    {
      'lp-card-sheen': props.sheen,
      'transition-[transform,border-color,box-shadow] duration-150 cursor-pointer hover:border-lp-border-strong hover:-translate-y-0.5':
        props.interactive,
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg':
        props.interactive,
    },
  ),
)

/** Padding lives on the body so header/footer dividers span the full width. */
const bodyClasses = computed(() => PADDINGS[props.padding])

const headerClasses = computed(() =>
  cn('border-b border-lp-border', PADDINGS[props.padding]),
)

const footerClasses = computed(() =>
  cn('border-t border-lp-border', PADDINGS[props.padding]),
)

function onKeydown(event: KeyboardEvent) {
  if (!isFocusableNonLink.value) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).click()
  }
}
</script>

<template>
  <!-- Single root: NuxtLink (via #components import) when linked, else the `as` tag.
       resolveComponent('NuxtLink') is avoided as it doesn't resolve at runtime under
       Nuxt's compile-time component auto-import. -->
  <component
    :is="isLink ? NuxtLink : as"
    :to="isLink ? to : undefined"
    :class="rootClasses"
    :tabindex="isFocusableNonLink ? 0 : undefined"
    :role="isFocusableNonLink ? 'button' : undefined"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
    @keydown="onKeydown"
  >
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>

    <div :class="bodyClasses">
      <slot />
    </div>

    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </component>
</template>
