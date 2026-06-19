<script setup lang="ts">
/**
 * LpSelect — styled native <select> (accessible, no custom popup).
 *
 * Follows the house Lp* pattern (see LpButton.vue):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive size class maps (plain objects)
 *  - `cn()` to compose, no external UI lib
 *  - real <select> element + visible focus ring + correct ARIA
 *  - label / hint / error mirror the LpInput field pattern
 *    (aria-invalid + aria-describedby wiring on error)
 *
 * The native control keeps full keyboard / screen-reader support; we only
 * restyle it (appearance-none) and overlay a non-interactive chevron.
 */
import { computed, useId } from 'vue'
import { cn } from '~/utils/cn'

type Size = 'sm' | 'md' | 'lg'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model value. */
    modelValue?: string | number
    options: SelectOption[]
    /** Rendered as a disabled, hidden-value first option. */
    placeholder?: string
    label?: string
    hint?: string
    error?: string
    size?: Size
    disabled?: boolean
    /** Explicit id; otherwise an auto id keeps label/hint/error wired. */
    id?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: undefined,
    label: undefined,
    hint: undefined,
    error: undefined,
    size: 'md',
    disabled: false,
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

// SSR-stable, unique-per-instance id (Vue 3.5+); avoids duplicate ids across selects.
const fallbackId = useId()

const selectId = computed(() => props.id ?? fallbackId)
const hintId = computed(() => `${selectId.value}-hint`)
const errorId = computed(() => `${selectId.value}-error`)

const hasError = computed(() => Boolean(props.error))
const describedBy = computed(() => {
  if (hasError.value) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})

/** A null/undefined model maps to '' so the placeholder option stays selected. */
const currentValue = computed(() =>
  props.modelValue === undefined || props.modelValue === null ? '' : props.modelValue,
)

const SIZES: Record<Size, string> = {
  sm: 'h-9 pl-3 pr-9 text-sm rounded-lp-sm',
  md: 'h-11 pl-3.5 pr-10 text-sm rounded-lp-md',
  lg: 'h-12 pl-4 pr-11 text-base rounded-lp-md',
}

const CHEVRON_POS: Record<Size, string> = {
  sm: 'right-2.5',
  md: 'right-3',
  lg: 'right-3.5',
}

const CHEVRON_SIZE: Record<Size, string> = { sm: '15', md: '17', lg: '19' }

const selectClasses = computed(() =>
  cn(
    'peer w-full appearance-none select-none cursor-pointer',
    'bg-lp-surface-2 border text-lp-text font-body leading-none',
    'transition-[border-color,box-shadow,background-color] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg',
    'focus:border-lp-accent',
    SIZES[props.size],
    hasError.value
      ? 'border-lp-red focus:border-lp-red focus-visible:ring-lp-red/60'
      : 'border-lp-border hover:border-lp-border-strong',
    { 'opacity-50 cursor-not-allowed pointer-events-none': props.disabled },
  ),
)

const chevronClasses = computed(() =>
  cn(
    'pointer-events-none absolute top-1/2 -translate-y-1/2',
    'transition-colors duration-150',
    CHEVRON_POS[props.size],
    hasError.value ? 'text-lp-red' : 'text-lp-text-muted peer-focus:text-lp-accent',
  ),
)

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="font-body">
    <label
      v-if="label"
      :for="selectId"
      class="mb-1.5 block text-sm font-medium text-lp-text-soft"
    >
      {{ label }}
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="currentValue"
        :disabled="disabled"
        :class="selectClasses"
        :aria-invalid="hasError || undefined"
        :aria-describedby="describedBy"
        @change="onChange"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
          hidden
        >
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <Icon
        name="lucide:chevron-down"
        :size="CHEVRON_SIZE[size]"
        :class="chevronClasses"
        aria-hidden="true"
      />
    </div>

    <p
      v-if="hasError"
      :id="errorId"
      class="mt-1.5 flex items-center gap-1 text-xs text-lp-red"
    >
      <Icon name="lucide:circle-alert" :size="13" aria-hidden="true" />
      <span>{{ error }}</span>
    </p>
    <p
      v-else-if="hint"
      :id="hintId"
      class="mt-1.5 text-xs text-lp-text-muted"
    >
      {{ hint }}
    </p>
  </div>
</template>
