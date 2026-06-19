<script setup lang="ts">
/**
 * LpTooltip — lightweight hover/focus tooltip.
 *
 * No positioning library: placement is pure CSS via translate utilities, so it is
 * fully SSR-safe (no measuring, no window/document access during setup). The
 * trigger is provided via the default slot and wrapped in a relative inline-flex
 * element. The bubble shows on mouseenter/focusin and hides on
 * mouseleave/focusout/Escape, driven by a single ref boolean.
 */
import { computed, ref, useId } from 'vue'
import { cn } from '~/utils/cn'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    /** Tooltip text content. */
    text: string
    /** Side of the trigger the bubble appears on. */
    placement?: Placement
    /** When true, the tooltip never shows. */
    disabled?: boolean
  }>(),
  {
    placement: 'top',
    disabled: false,
  },
)

// SSR-stable id (Vue 3.5+) — no Math.random() at setup, no hydration mismatch.
const tooltipId = useId()

const open = ref(false)

const canShow = computed(() => !props.disabled && props.text.length > 0)

function show(): void {
  if (canShow.value) open.value = true
}

function hide(): void {
  open.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') hide()
}

/** Per-placement bubble position + entry/exit transform origin. */
const PLACEMENTS: Record<Placement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const bubbleClasses = computed(() =>
  cn(
    'pointer-events-none absolute',
    'bg-lp-surface-3 text-lp-text-soft text-xs px-2 py-1',
    'rounded-lp-sm shadow-lp-card border border-lp-border',
    'whitespace-nowrap font-body',
    PLACEMENTS[props.placement],
  ),
)
</script>

<template>
  <span
    class="relative inline-flex"
    :aria-describedby="open && canShow ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown="onKeydown"
  >
    <slot />
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      leave-active-class="transition-opacity duration-100 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <span
        v-if="open && canShow"
        :id="tooltipId"
        role="tooltip"
        :class="bubbleClasses"
        :style="{ zIndex: 'var(--lp-z-tooltip)' }"
      >
        {{ text }}
      </span>
    </Transition>
  </span>
</template>
