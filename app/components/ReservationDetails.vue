<script setup lang="ts">
import type { ReservationResponse } from '../../../backend/types_pour_le_frontend'

const props = defineProps<{ reservation: ReservationResponse }>()

const dateLabel = computed(() => {
  const d = new Date(props.reservation.slot.date + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const isConfirmed = computed(() => props.reservation.status === 'confirmed')
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

    <!-- Status accent strip -->
    <div class="h-1" :class="isConfirmed ? 'bg-green-500' : 'bg-red-400'" />

    <!-- Restaurant info -->
    <div class="p-5 flex items-start gap-4 border-b border-gray-100">
      <div
        class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
        :class="isConfirmed ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'"
      >
        {{ reservation.restaurant.name.charAt(0) }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 leading-snug">{{ reservation.restaurant.name }}</h3>
        <span
          class="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="isConfirmed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              v-if="isConfirmed"
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clip-rule="evenodd"
            />
            <path
              v-else
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clip-rule="evenodd"
            />
          </svg>
          {{ isConfirmed ? 'Confirmée' : 'Annulée' }}
        </span>
      </div>
    </div>

    <!-- Reservation details -->
    <div class="p-5">
      <div class="space-y-3 text-sm">

        <!-- Date -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <div class="flex justify-between gap-4 flex-1 min-w-0">
            <span class="text-gray-500 shrink-0">Date</span>
            <span class="font-medium text-gray-900 text-right capitalize">{{ dateLabel }}</span>
          </div>
        </div>

        <!-- Horaire -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex justify-between gap-4 flex-1">
            <span class="text-gray-500">Horaire</span>
            <span class="font-medium text-gray-900">{{ reservation.slot.startTime }} – {{ reservation.slot.endTime }}</span>
          </div>
        </div>

        <!-- Couverts -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div class="flex justify-between gap-4 flex-1">
            <span class="text-gray-500">Couverts</span>
            <span class="font-medium text-gray-900">
              {{ reservation.covers }} personne{{ reservation.covers > 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-100" />

        <!-- Nom -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div class="flex justify-between gap-4 flex-1">
            <span class="text-gray-500">Nom</span>
            <span class="font-medium text-gray-900">{{ reservation.customer.name }}</span>
          </div>
        </div>

        <!-- Email -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div class="flex justify-between gap-4 flex-1 min-w-0">
            <span class="text-gray-500 shrink-0">Email</span>
            <span class="font-medium text-gray-900 text-right break-all">{{ reservation.customer.email }}</span>
          </div>
        </div>

        <!-- Téléphone -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
          <div class="flex justify-between gap-4 flex-1">
            <span class="text-gray-500">Téléphone</span>
            <span class="font-medium text-gray-900">{{ reservation.customer.phone }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Actions slot -->
    <div v-if="$slots.actions" class="px-5 pb-5">
      <slot name="actions" />
    </div>

  </div>
</template>