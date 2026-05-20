<script setup lang="ts">
import type { SlotResponse } from '../../../backend/types_pour_le_frontend'

defineProps<{
  slots: SlotResponse[]
  selectedSlotId?: string
}>()
const emit = defineEmits<{ select: [slot: SlotResponse] }>()
</script>

<template>
  <div v-if="slots.length === 0" class="text-center py-10 text-gray-400 text-sm">
    Aucun créneau disponible pour cette date.
  </div>
  <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
    <button
      v-for="slot in slots"
      :key="slot.id"
      type="button"
      :disabled="slot.status === 'full'"
      :class="[
        'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors text-sm',
        slot.status === 'full'
          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
          : selectedSlotId === slot.id
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
            : 'border-gray-200 hover:border-indigo-400 bg-white',
      ]"
      @click="emit('select', slot)"
    >
      <span class="font-semibold">{{ slot.startTime }} – {{ slot.endTime }}</span>
      <SlotBadge :status="slot.status" />
    </button>
  </div>
</template>