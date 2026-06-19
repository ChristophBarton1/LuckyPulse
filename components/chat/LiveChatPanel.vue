<script setup lang="ts">
/**
 * LiveChatPanel — live community chat card for the Live Hub.
 *
 * Follows the canonical Lp* house pattern:
 *  - typed props via `withDefaults(defineProps<...>())`, nothing `any`
 *  - prop-driven only: messages + online count come from the page; no fetching,
 *    no internal mock data, no business content baked in
 *  - reuses LpCard / LpAvatar / LpButton from the base kit; only the chat-specific
 *    layout (header / message list / composer) is hand-rolled
 *  - token-only styling, font-mono for every number, visible focus rings
 *  - composer is UI-only for now (no send logic wired up)
 *
 * PERF: the message list is rendered eagerly. Beyond ~100 messages this should be
 * virtualized (e.g. windowed rendering / IntersectionObserver) to keep the DOM light;
 * the surrounding scroll container + per-row contract already supports that swap.
 */
import { computed } from 'vue'
import type { ChatMessage } from '~/types/domain'
import { formatCompact } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    messages: ChatMessage[]
    online: number
  }>(),
  {
    messages: () => [],
    online: 0,
  },
)

type Badge = NonNullable<ChatMessage['badge']>

/** Author name colour per badge tier. */
const AUTHOR_TONE: Record<Badge, string> = {
  vip: 'text-lp-gold',
  verified: 'text-lp-cyan',
  host: 'text-lp-purple',
}

/** Marker icon + colour shown after the author name per badge tier. */
const BADGE_MARKER: Record<Badge, { icon: string; tone: string; label: string }> = {
  vip: { icon: 'lucide:crown', tone: 'text-lp-gold', label: 'VIP member' },
  verified: { icon: 'lucide:badge-check', tone: 'text-lp-cyan', label: 'Verified' },
  host: { icon: 'lucide:shield', tone: 'text-lp-purple', label: 'Room host' },
}

const onlineLabel = computed(() => formatCompact(props.online))

function authorClass(badge: ChatMessage['badge']): string {
  return badge ? AUTHOR_TONE[badge] : 'text-lp-text'
}
</script>

<template>
  <LpCard padding="none" class="flex h-full min-h-0 flex-col">
    <!-- HEADER -->
    <header
      class="flex items-center justify-between gap-3 border-b border-lp-border px-4 py-3"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <h2 class="font-heading text-sm font-semibold text-lp-text">Live Chat</h2>
        <span class="inline-flex items-center gap-1.5 text-xs text-lp-text-muted">
          <span class="h-2 w-2 shrink-0 rounded-full bg-lp-green" aria-hidden="true" />
          <span><span class="font-mono">{{ onlineLabel }}</span> online</span>
        </span>
      </div>

      <span
        class="inline-flex shrink-0 items-center gap-1 text-xs text-lp-text-muted"
        title="Top voters in this room"
      >
        <Icon name="lucide:trophy" :size="13" class="text-lp-gold" aria-hidden="true" />
        Top Voters
      </span>
    </header>

    <!-- MESSAGES -->
    <div
      class="lp-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3"
      role="log"
      aria-live="polite"
      aria-label="Live chat messages"
    >
      <div
        v-for="m in messages"
        :key="m.id"
        class="flex items-start gap-2.5 animate-lp-fade-in"
      >
        <LpAvatar :name="m.author" size="xs" />

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <span class="text-sm font-medium" :class="authorClass(m.badge)">
              {{ m.author }}
            </span>
            <Icon
              v-if="m.badge"
              :name="BADGE_MARKER[m.badge].icon"
              :size="12"
              :class="BADGE_MARKER[m.badge].tone"
              :aria-label="BADGE_MARKER[m.badge].label"
              role="img"
            />
            <span class="ml-1 text-[11px] text-lp-text-muted">{{ m.timeLabel }}</span>
          </div>
          <p class="break-words text-sm text-lp-text-soft">{{ m.text }}</p>
        </div>

        <span
          v-if="m.votes"
          class="shrink-0 rounded-full bg-lp-surface-3 px-2 py-0.5 font-mono text-[11px] text-lp-text-soft"
          :aria-label="`${m.votes} votes`"
        >
          {{ formatCompact(m.votes) }}
        </span>
      </div>
    </div>

    <!-- FOOTER / COMPOSER -->
    <footer class="border-t border-lp-border px-3 py-3">
      <form class="flex items-center gap-2" @submit.prevent>
        <input
          type="text"
          placeholder="Type a message..."
          aria-label="Chat message"
          class="h-10 flex-1 rounded-lp-md border border-lp-border bg-lp-surface-2 px-3 text-sm text-lp-text placeholder:text-lp-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
        />
        <button
          type="button"
          aria-label="Emoji"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lp-md border border-lp-border bg-lp-surface-2 text-lp-text-soft transition-colors duration-150 hover:bg-lp-surface-3 hover:text-lp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
        >
          <Icon name="lucide:smile" :size="18" aria-hidden="true" />
        </button>
        <LpButton size="sm" icon="send" aria-label="Send" />
      </form>
    </footer>
  </LpCard>
</template>
