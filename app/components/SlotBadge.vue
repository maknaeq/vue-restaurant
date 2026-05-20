<script setup lang="ts">
import type { SlotStatus } from '../../../backend/types_pour_le_frontend'

defineProps<{ status: SlotStatus }>()

const labels: Record<SlotStatus, string> = {
  free: 'Disponible',
  nearly_full: 'Presque plein',
  full: 'Complet',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      status === 'free'
        ? 'bg-green-100 text-green-700'
        : status === 'nearly_full'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-red-100 text-red-600',
    ]"
  >
    {{ labels[status] }}
  </span>
</template>