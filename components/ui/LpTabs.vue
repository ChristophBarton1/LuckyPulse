<script setup lang="ts">
/**
 * LpTabs — horizontal tab switcher for primary nav (Lobby / Live Rooms / Leaderboard)
 * and category filters.
 *
 * Follows the house Lp* pattern:
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive variant/size class maps (plain objects)
 *  - `cn()` to compose, no external UI lib
 *  - real semantic elements (role="tablist" + role="tab" buttons)
 *  - full keyboard support (ArrowLeft/ArrowRight/Home/End) + visible focus ring
 */
import { computed, ref } from 'vue'
import { cn } from '~/utils/cn'

interface LpTab {
  value: string
  label: string
  /** Lucide icon name (without the `lucide:` prefix). */
  icon?: string
  count?: number
}

type Variant = 'underline' | 'pill'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    tabs: LpTab[]
    /** Active tab value (v-model). */
    modelValue: string
    variant?: Variant
    size?: Size
  }>(),
  {
    variant: 'underline',
    size: 'md',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

/** Refs to each tab button so keyboard navigation can move focus. */
const tabRefs = ref<HTMLButtonElement[]>([])

const LIST_VARIANTS: Record<Variant, string> = {
  underline: 'gap-1 border-b border-lp-border',
  pill: 'gap-1.5',
}

const LIST_SIZES: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-sm',
}

const TAB_BASE =
  'relative inline-flex items-center justify-center whitespace-nowrap select-none font-body ' +
  'transition-[color,background-color,border-color] duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg'

const TAB_VARIANTS: Record<Variant, { base: string; active: string; inactive: string }> = {
  underline: {
    base: 'border-b-2 border-transparent -mb-px rounded-t-lp-sm',
    active: 'text-lp-text border-lp-accent',
    inactive: 'text-lp-text-muted hover:text-lp-text',
  },
  pill: {
    base: 'rounded-lp-md',
    active: 'bg-lp-surface-3 text-lp-text',
    inactive: 'text-lp-text-muted hover:text-lp-text hover:bg-lp-surface-2',
  },
}

const TAB_SIZES: Record<Variant, Record<Size, string>> = {
  underline: {
    sm: 'h-9 px-2.5 gap-1.5',
    md: 'h-11 px-3 gap-2',
  },
  pill: {
    sm: 'h-9 px-3 gap-1.5',
    md: 'h-10 px-3.5 gap-2',
  },
}

const ICON_SIZE: Record<Size, number> = { sm: 15, md: 17 }

const tabClasses = (value: string): string =>
  cn(
    TAB_BASE,
    TAB_VARIANTS[props.variant].base,
    TAB_SIZES[props.variant][props.size],
    value === props.modelValue
      ? TAB_VARIANTS[props.variant].active
      : TAB_VARIANTS[props.variant].inactive,
  )

const countClasses = (value: string): string =>
  cn(
    'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full',
    'font-mono text-[0.6875rem] leading-none tabular-nums',
    value === props.modelValue
      ? 'bg-lp-accent/15 text-lp-accent'
      : 'bg-lp-surface-2 text-lp-text-soft',
  )

const select = (value: string): void => {
  if (value !== props.modelValue) emit('update:modelValue', value)
}

const focusTab = (index: number): void => {
  const el = tabRefs.value[index]
  if (el) el.focus()
}

/** Roving-tabindex keyboard navigation; moving focus also moves selection. */
const onKeydown = (event: KeyboardEvent, index: number): void => {
  const count = props.tabs.length
  if (count === 0) return

  let next = -1
  switch (event.key) {
    case 'ArrowRight':
      next = (index + 1) % count
      break
    case 'ArrowLeft':
      next = (index - 1 + count) % count
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = count - 1
      break
    default:
      return
  }

  event.preventDefault()
  select(props.tabs[next].value)
  focusTab(next)
}
</script>

<template>
  <div
    role="tablist"
    :aria-orientation="'horizontal'"
    :class="cn('inline-flex items-end', LIST_VARIANTS[variant], LIST_SIZES[size])"
  >
    <button
      v-for="(tab, index) in tabs"
      :key="tab.value"
      :ref="(el) => { if (el) tabRefs[index] = el as HTMLButtonElement }"
      type="button"
      role="tab"
      :aria-selected="tab.value === modelValue"
      :tabindex="tab.value === modelValue ? 0 : -1"
      :class="tabClasses(tab.value)"
      @click="select(tab.value)"
      @keydown="onKeydown($event, index)"
    >
      <Icon
        v-if="tab.icon"
        :name="`lucide:${tab.icon}`"
        :size="ICON_SIZE[size]"
        aria-hidden="true"
      />
      <span>{{ tab.label }}</span>
      <span v-if="tab.count !== undefined" :class="countClasses(tab.value)">
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>
