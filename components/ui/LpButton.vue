<script setup lang="ts">
/**
 * LpButton — canonical interactive button.
 *
 * House pattern for every Lp* component:
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive variant/size class maps (plain objects)
 *  - `cn()` to compose, no external UI lib
 *  - real semantic element + visible focus ring + correct ARIA
 *  - renders as <NuxtLink> when `to` is supplied, otherwise <button>
 */
import { computed, resolveComponent } from 'vue'
import { cn } from '~/utils/cn'

type Variant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** Lucide icon name (without the `lucide:` prefix), shown before the label. */
    icon?: string
    /** Lucide icon name, shown after the label. */
    iconRight?: string
    block?: boolean
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    /** When set, renders a NuxtLink instead of a button. */
    to?: string
    /** Accessible label when the button has no visible text (icon-only). */
    ariaLabel?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    icon: undefined,
    iconRight: undefined,
    block: false,
    loading: false,
    disabled: false,
    type: 'button',
    to: undefined,
    ariaLabel: undefined,
  },
)

defineEmits<{ click: [event: MouseEvent] }>()

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-lp-gold-gradient text-lp-bg font-semibold shadow-glow-gold hover:brightness-105',
  accent: 'bg-lp-accent-gradient text-lp-bg font-semibold shadow-glow-accent hover:brightness-105',
  secondary: 'bg-lp-surface-2 text-lp-text border border-lp-border hover:bg-lp-surface-3',
  outline:
    'border border-lp-border-strong text-lp-text hover:border-lp-accent hover:text-lp-accent',
  ghost: 'text-lp-text-soft hover:bg-lp-surface-2 hover:text-lp-text',
  danger: 'bg-lp-red text-white hover:brightness-110',
  success: 'bg-lp-green text-lp-bg font-semibold hover:brightness-105',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-lp-sm',
  md: 'h-11 px-4 text-sm gap-2 rounded-lp-md',
  lg: 'h-12 px-5 text-base gap-2 rounded-lp-md',
}

const ICON_SIZE: Record<Size, string> = { sm: '15', md: '17', lg: '19' }

const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() =>
  cn(
    'relative inline-flex items-center justify-center whitespace-nowrap select-none',
    'font-body transition-[filter,background-color,border-color,color] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg',
    VARIANTS[props.variant],
    SIZES[props.size],
    { 'w-full': props.block },
    { 'opacity-50 pointer-events-none': isDisabled.value },
  ),
)
</script>

<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :class="classes"
    :disabled="to ? undefined : isDisabled"
    :aria-busy="loading || undefined"
    :aria-disabled="to && isDisabled ? 'true' : undefined"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  >
    <Icon
      v-if="loading"
      name="lucide:loader-2"
      class="animate-spin"
      :size="ICON_SIZE[size]"
      aria-hidden="true"
    />
    <Icon
      v-else-if="icon"
      :name="`lucide:${icon}`"
      :size="ICON_SIZE[size]"
      aria-hidden="true"
    />
    <span v-if="$slots.default"><slot /></span>
    <Icon
      v-if="iconRight && !loading"
      :name="`lucide:${iconRight}`"
      :size="ICON_SIZE[size]"
      aria-hidden="true"
    />
  </component>
</template>
