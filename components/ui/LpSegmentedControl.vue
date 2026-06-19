<script setup lang="ts">
/**
 * LpSegmentedControl — compact 2..n segmented toggle.
 *
 * Used for binary/short switches (e.g. Sports | Esports, time ranges).
 * Follows the house pattern (see LpButton.vue): typed props via
 * `withDefaults(defineProps<...>())`, mutually-exclusive class maps, `cn()`
 * to compose, real semantic ARIA (radiogroup / radio) + keyboard support.
 */
import { computed, ref } from 'vue'
import { cn } from '~/utils/cn'

type Size = 'sm' | 'md'

interface SegmentOption {
  value: string
  label: string
  /** Lucide icon name (without the `lucide:` prefix), shown before the label. */
  icon?: string
}

const props = withDefaults(
  defineProps<{
    /** Currently selected value (v-model). */
    modelValue: string
    options: SegmentOption[]
    size?: Size
    /** Full width with equal-width segments. */
    block?: boolean
    /** Accessible label for the radiogroup. Defaults so the group always has a name. */
    ariaLabel?: string
  }>(),
  {
    size: 'md',
    block: false,
    ariaLabel: 'Options',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const SIZES: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
}

const SEGMENT_SIZES: Record<Size, string> = {
  sm: 'h-7 px-2.5 gap-1.5',
  md: 'h-9 px-3 gap-2',
}

const ICON_SIZE: Record<Size, string> = { sm: '14', md: '16' }

const containerClasses = computed(() =>
  cn(
    'inline-flex items-center gap-1 p-1',
    'bg-lp-surface-2 border border-lp-border rounded-lp-md',
    'font-medium font-body',
    SIZES[props.size],
    { 'w-full': props.block },
  ),
)

const segmentClasses = (active: boolean) =>
  cn(
    'relative inline-flex items-center justify-center whitespace-nowrap select-none',
    'rounded-lp-sm transition-[background-color,color,box-shadow] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg',
    SEGMENT_SIZES[props.size],
    { 'flex-1': props.block },
    active
      ? 'bg-lp-surface-3 text-lp-text shadow-sm'
      : 'text-lp-text-muted hover:text-lp-text',
  )

const selectedIndex = computed(() =>
  props.options.findIndex((option) => option.value === props.modelValue),
)

/** Refs to each segment button so keyboard navigation can move focus. */
const segmentRefs = ref<HTMLButtonElement[]>([])

function setSegmentRef(el: Element | null, index: number) {
  if (el) segmentRefs.value[index] = el as HTMLButtonElement
}

function select(value: string) {
  if (value !== props.modelValue) emit('update:modelValue', value)
}

function focusIndex(index: number) {
  const target = segmentRefs.value[index]
  if (target) target.focus()
}

function move(delta: number) {
  const count = props.options.length
  if (count === 0) return
  const current = selectedIndex.value < 0 ? 0 : selectedIndex.value
  const next = (current + delta + count) % count
  const option = props.options[next]
  if (!option) return
  select(option.value)
  focusIndex(next)
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'Home':
      event.preventDefault()
      if (props.options[0]) {
        select(props.options[0].value)
        focusIndex(0)
      }
      break
    case 'End': {
      event.preventDefault()
      const last = props.options.length - 1
      if (props.options[last]) {
        select(props.options[last].value)
        focusIndex(last)
      }
      break
    }
    default:
      break
  }
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="ariaLabel"
    :class="containerClasses"
    @keydown="onKeydown"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => setSegmentRef(el as Element | null, index)"
      type="button"
      role="radio"
      :aria-checked="option.value === modelValue"
      :tabindex="option.value === modelValue || (selectedIndex < 0 && index === 0) ? 0 : -1"
      :class="segmentClasses(option.value === modelValue)"
      @click="select(option.value)"
    >
      <Icon
        v-if="option.icon"
        :name="`lucide:${option.icon}`"
        :size="ICON_SIZE[size]"
        aria-hidden="true"
      />
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>
