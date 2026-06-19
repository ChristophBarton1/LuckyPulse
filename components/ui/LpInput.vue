<script setup lang="ts">
/**
 * LpInput — text input with label, hint/error, and optional leading icon.
 *
 * Follows the house pattern (see LpButton.vue):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive size class maps (plain objects)
 *  - `cn()` to compose, no external UI lib
 *  - real <label>/<input>, correct ARIA (aria-invalid / aria-describedby), visible focus ring
 *
 * `inheritAttrs` is disabled so stray attributes land on the <input>, not the wrapper.
 */
import { computed, useId } from 'vue'
import { cn } from '~/utils/cn'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model value. */
    modelValue?: string | number
    type?: string
    label?: string
    placeholder?: string
    /** Helper text shown below the field when there is no error. */
    hint?: string
    /** Error message; when set, overrides the hint and flips the field into the invalid state. */
    error?: string
    /** Lucide icon name (without the `lucide:` prefix), shown inside the field on the left. */
    icon?: string
    size?: Size
    disabled?: boolean
    /** Explicit id; a stable SSR-safe fallback is generated when omitted. */
    id?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    label: undefined,
    placeholder: undefined,
    hint: undefined,
    error: undefined,
    icon: undefined,
    size: 'md',
    disabled: false,
    id: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

defineOptions({ inheritAttrs: false })

// SSR-stable, unique-per-instance id (Vue 3.5+); avoids hydration mismatches and
// duplicate ids when multiple inputs render without an explicit id.
const fallbackId = useId()
const inputId = computed(() => props.id ?? fallbackId)
const messageId = computed(() => `${inputId.value}-msg`)

const hasError = computed(() => Boolean(props.error))
const message = computed(() => props.error ?? props.hint)

const SIZES: Record<Size, string> = {
  sm: 'h-9 text-sm rounded-lp-sm',
  md: 'h-11 text-sm rounded-lp-md',
  lg: 'h-12 text-base rounded-lp-md',
}

// Horizontal padding pairs: [without icon, with icon].
const PADDING: Record<Size, { plain: string; withIcon: string }> = {
  sm: { plain: 'px-3', withIcon: 'pl-9 pr-3' },
  md: { plain: 'px-3.5', withIcon: 'pl-10 pr-3.5' },
  lg: { plain: 'px-4', withIcon: 'pl-11 pr-4' },
}

const ICON_SIZE: Record<Size, string> = { sm: '15', md: '17', lg: '19' }
const ICON_LEFT: Record<Size, string> = { sm: 'left-3', md: 'left-3.5', lg: 'left-4' }

const inputClasses = computed(() =>
  cn(
    'w-full bg-lp-surface-2 text-lp-text font-body placeholder:text-lp-text-muted',
    'border transition-[border-color,box-shadow] duration-150',
    'focus:outline-none',
    SIZES[props.size],
    props.icon ? PADDING[props.size].withIcon : PADDING[props.size].plain,
    hasError.value
      ? 'border-lp-red focus:border-lp-red'
      : 'border-lp-border focus:border-lp-accent',
    { 'opacity-50 cursor-not-allowed': props.disabled },
  ),
)

// Ring sits on the wrapper so the icon + input glow together, but gated on
// :focus-visible (via :has) so it only appears for keyboard focus — matching the
// house focus-visible convention used by every other Lp* component.
const fieldWrapperClasses = computed(() =>
  cn(
    'relative rounded-lp-md ring-offset-2 ring-offset-lp-bg',
    'has-[:focus-visible]:ring-2',
    hasError.value ? 'has-[:focus-visible]:ring-lp-red/60' : 'has-[:focus-visible]:ring-lp-accent/60',
  ),
)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="font-body">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm text-lp-text-soft mb-1.5"
    >
      {{ label }}
    </label>

    <div :class="fieldWrapperClasses">
      <Icon
        v-if="icon"
        :name="`lucide:${icon}`"
        :size="ICON_SIZE[size]"
        :class="
          cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2',
            ICON_LEFT[size],
            hasError ? 'text-lp-red' : 'text-lp-text-muted',
          )
        "
        aria-hidden="true"
      />
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="hasError || undefined"
        :aria-describedby="message ? messageId : undefined"
        :class="inputClasses"
        v-bind="$attrs"
        @input="onInput"
      >
    </div>

    <p
      v-if="message"
      :id="messageId"
      :class="
        cn('mt-1.5 text-xs', hasError ? 'text-lp-red' : 'text-lp-text-muted')
      "
    >
      {{ message }}
    </p>
  </div>
</template>
