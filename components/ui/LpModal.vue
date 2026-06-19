<script setup lang="ts">
/**
 * LpModal — accessible dialog (v-model open state).
 *
 * Mirrors the house Lp* pattern: typed props via `withDefaults`, mutually-exclusive
 * size class maps, `cn()` to compose. Renders into <body> via Teleport (wrapped in
 * <ClientOnly> for SSR-safety) with a fade/scale Transition.
 *
 * Behaviour:
 *  - on open: lock body scroll + focus the panel
 *  - on close: restore scroll + emit `close`
 *  - Esc / backdrop click close unless `persistent`
 *  - keydown listener + body style are cleaned up on unmount
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn } from '~/utils/cn'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** v-model: dialog open state. */
    modelValue: boolean
    title?: string
    description?: string
    size?: Size
    /** When true, backdrop click + Esc do NOT close the dialog. */
    persistent?: boolean
  }>(),
  {
    title: undefined,
    description: undefined,
    size: 'md',
    persistent: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const SIZES: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

const panelClasses = computed(() =>
  cn(
    'relative w-full max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden',
    'bg-lp-surface border border-lp-border rounded-lp-xl shadow-lp-card',
    'font-body text-lp-text outline-none lp-card-sheen',
    SIZES[props.size],
  ),
)

/** Stable ids so aria-labelledby / aria-describedby reference real nodes. */
const uid = Math.random().toString(36).slice(2, 9)
const titleId = `lp-modal-title-${uid}`
const descId = `lp-modal-desc-${uid}`

const labelledBy = computed(() => (props.title ? titleId : undefined))
const describedBy = computed(() => (props.description ? descId : undefined))

const panel = ref<HTMLElement | null>(null)
// Element focused before the dialog opened — focus is returned here on close.
const previouslyFocused = ref<HTMLElement | null>(null)

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function close(): void {
  if (!props.modelValue) return
  emit('update:modelValue', false)
  emit('close')
}

function onBackdrop(): void {
  if (props.persistent) return
  close()
}

/** Keep Tab focus cycling inside the panel (aria-modal contract). */
function trapTab(event: KeyboardEvent): void {
  if (!panel.value) return
  const items = Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
  if (items.length === 0) {
    event.preventDefault()
    panel.value.focus()
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  if (event.shiftKey && (active === first || active === panel.value)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (!props.modelValue) return
  if (event.key === 'Escape' && !props.persistent) {
    event.stopPropagation()
    close()
  } else if (event.key === 'Tab') {
    trapTab(event)
  }
}

function lockScroll(): void {
  document.body.style.overflow = 'hidden'
}

function unlockScroll(): void {
  document.body.style.overflow = ''
}

function focusPanel(): void {
  // Defer so the element exists in the DOM after the Transition mounts it.
  requestAnimationFrame(() => panel.value?.focus())
}

function restoreFocus(): void {
  previouslyFocused.value?.focus?.()
  previouslyFocused.value = null
}

watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      previouslyFocused.value = document.activeElement as HTMLElement | null
      lockScroll()
      focusPanel()
    } else {
      unlockScroll()
      restoreFocus()
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  if (props.modelValue) {
    previouslyFocused.value = document.activeElement as HTMLElement | null
    lockScroll()
    focusPanel()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  unlockScroll()
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="modelValue"
          class="fixed inset-0 flex items-center justify-center p-4 bg-lp-bg/80 backdrop-blur-sm"
          :style="{ zIndex: 'var(--lp-z-modal)' }"
          @click="onBackdrop"
        >
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            appear
          >
            <div
              ref="panel"
              :class="panelClasses"
              role="dialog"
              aria-modal="true"
              :aria-labelledby="labelledBy"
              :aria-describedby="describedBy"
              tabindex="-1"
              @click.stop
            >
              <!-- Header -->
              <slot name="header">
                <div
                  v-if="title || description"
                  class="flex items-start gap-4 px-6 pt-6 pb-4 border-b border-lp-border"
                >
                  <div class="min-w-0 flex-1">
                    <h2
                      v-if="title"
                      :id="titleId"
                      class="font-heading text-lg font-semibold text-lp-text"
                    >
                      {{ title }}
                    </h2>
                    <p
                      v-if="description"
                      :id="descId"
                      class="mt-1 text-sm text-lp-text-muted"
                    >
                      {{ description }}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    class="-mr-1.5 -mt-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lp-sm text-lp-text-muted transition-colors duration-150 hover:bg-lp-surface-2 hover:text-lp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
                    @click="close"
                  >
                    <Icon name="lucide:x" :size="18" aria-hidden="true" />
                  </button>
                </div>
              </slot>

              <!-- Floating close button when no header is rendered -->
              <button
                v-if="!$slots.header && !title && !description"
                type="button"
                aria-label="Close"
                class="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lp-sm text-lp-text-muted transition-colors duration-150 hover:bg-lp-surface-2 hover:text-lp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
                @click="close"
              >
                <Icon name="lucide:x" :size="18" aria-hidden="true" />
              </button>

              <!-- Body -->
              <div class="lp-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5 text-sm text-lp-text-soft">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="flex items-center justify-end gap-3 border-t border-lp-border px-6 py-4"
              >
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
