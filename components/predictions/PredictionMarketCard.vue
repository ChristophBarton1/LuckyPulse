<script setup lang="ts">
/**
 * PredictionMarketCard — one prediction market with selectable options.
 *
 * Prop-driven + optimistic: the parent owns the pick (selectedOptionId) and updates it
 * on the `pick` event, so selection feels instant before any server/WS confirmation.
 * Legal-safe: picks cost nothing real; rewards are virtual points only.
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'
import type { PredictionMarket } from '~/types/domain'

const props = withDefaults(
  defineProps<{
    market: PredictionMarket
    /** The option this user has picked (if any). */
    selectedOptionId?: string | null
  }>(),
  { selectedOptionId: null },
)

defineEmits<{ pick: [marketId: string, optionId: string] }>()

const canPick = computed(() => props.market.status === 'open' || props.market.status === 'closing')

const STATUS: Record<
  PredictionMarket['status'],
  { label: string; variant: 'green' | 'red' | 'neutral' | 'purple' }
> = {
  open: { label: 'Open', variant: 'green' },
  closing: { label: 'Closing', variant: 'red' },
  closed: { label: 'Locked', variant: 'neutral' },
  resolved: { label: 'Resolved', variant: 'purple' },
}

const RISK: Record<PredictionMarket['riskLevel'], string> = {
  low: 'text-lp-green',
  medium: 'text-lp-text-muted',
  high: 'text-lp-red',
}

function optionClasses(optionId: string): string {
  const isSelected = props.selectedOptionId === optionId
  const isWinner = props.market.status === 'resolved' && props.market.resultOptionId === optionId
  return cn(
    'relative w-full overflow-hidden rounded-lp-md border px-3 py-2.5 text-left transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg',
    canPick.value ? 'cursor-pointer hover:border-lp-border-strong' : 'cursor-default',
    isWinner
      ? 'border-lp-green bg-lp-green/10'
      : isSelected
        ? 'border-lp-accent bg-lp-accent/10'
        : 'border-lp-border bg-lp-surface-2',
  )
}
</script>

<template>
  <LpCard padding="md">
    <!-- Header -->
    <div class="mb-3 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="font-medium text-lp-text">{{ market.question }}</p>
        <p class="mt-0.5 text-xs">
          <span class="font-mono text-lp-accent">×{{ market.pointsMultiplier }}</span>
          <span class="text-lp-text-muted"> reward ·</span>
          <span :class="RISK[market.riskLevel]"> {{ market.riskLevel }} risk</span>
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span
          v-if="market.closesInLabel && canPick"
          class="font-mono text-xs"
          :class="market.status === 'closing' ? 'text-lp-red' : 'text-lp-text-muted'"
        >
          <Icon name="lucide:clock" :size="12" class="mr-0.5 inline -translate-y-px" aria-hidden="true" />
          {{ market.closesInLabel }}
        </span>
        <LpBadge :variant="STATUS[market.status].variant" size="sm" uppercase>
          {{ STATUS[market.status].label }}
        </LpBadge>
      </div>
    </div>

    <!-- Options -->
    <div class="space-y-2">
      <button
        v-for="opt in market.options"
        :key="opt.id"
        type="button"
        :class="optionClasses(opt.id)"
        :disabled="!canPick"
        :aria-pressed="selectedOptionId === opt.id"
        @click="canPick && $emit('pick', market.id, opt.id)"
      >
        <!-- Sentiment bar -->
        <div
          class="absolute inset-y-0 left-0 bg-lp-surface-3"
          :style="{ width: `${opt.pct ?? 0}%` }"
          aria-hidden="true"
        />
        <div class="relative flex items-center justify-between gap-2">
          <span class="flex items-center gap-2 font-medium text-lp-text">
            <Icon
              v-if="market.status === 'resolved' && market.resultOptionId === opt.id"
              name="lucide:check"
              :size="15"
              class="text-lp-green"
              aria-hidden="true"
            />
            <Icon
              v-else-if="selectedOptionId === opt.id"
              name="lucide:check-circle-2"
              :size="15"
              class="text-lp-accent"
              aria-hidden="true"
            />
            {{ opt.label }}
          </span>
          <span class="font-mono text-xs text-lp-text-muted">{{ opt.pct ?? 0 }}%</span>
        </div>
      </button>
    </div>

    <p v-if="selectedOptionId && canPick" class="mt-2.5 flex items-center gap-1.5 text-xs text-lp-green">
      <Icon name="lucide:check-circle-2" :size="13" aria-hidden="true" />
      Pick locked — you can change it until the market closes.
    </p>
  </LpCard>
</template>
