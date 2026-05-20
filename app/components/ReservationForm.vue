<script setup lang="ts">
import type { SlotResponse, Restaurant, CreateReservation } from '../../../backend/types_pour_le_frontend'

interface FormErrors {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  global?: string
}

const props = defineProps<{
  slot: SlotResponse
  restaurant: Restaurant
  covers: number
  loading?: boolean
  errors?: FormErrors
}>()

const emit = defineEmits<{
  submit: [data: CreateReservation]
  cancel: []
}>()

const form = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
})

const dateLabel = computed(() =>
  new Date(props.slot.date + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
)

function onSubmit() {
  emit('submit', {
    restaurantId: props.restaurant.id,
    timeSlotId: props.slot.id,
    customerName: form.customerName,
    customerEmail: form.customerEmail,
    customerPhone: form.customerPhone,
    covers: props.covers,
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <!-- Slot summary -->
    <div class="bg-indigo-50 rounded-xl p-3 text-sm text-indigo-700">
      Le <strong>{{ dateLabel }}</strong> à <strong>{{ slot.startTime }}</strong>
      pour <strong>{{ covers }} personne{{ covers > 1 ? 's' : '' }}</strong>
    </div>

    <!-- Global error -->
    <div v-if="errors?.global" class="bg-red-50 text-red-700 text-sm rounded-lg p-3">
      {{ errors.global }}
    </div>

    <!-- Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
      <input
        v-model="form.customerName"
        type="text"
        required
        placeholder="Jean Dupont"
        class="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
        :class="errors?.customerName ? 'border-red-400 bg-red-50' : 'border-gray-300'"
      />
      <p v-if="errors?.customerName" class="text-xs text-red-600 mt-1">{{ errors.customerName }}</p>
    </div>

    <!-- Email -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        v-model="form.customerEmail"
        type="email"
        required
        placeholder="jean@exemple.fr"
        class="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
        :class="errors?.customerEmail ? 'border-red-400 bg-red-50' : 'border-gray-300'"
      />
      <p v-if="errors?.customerEmail" class="text-xs text-red-600 mt-1">{{ errors.customerEmail }}</p>
    </div>

    <!-- Phone -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
      <input
        v-model="form.customerPhone"
        type="tel"
        required
        placeholder="06 12 34 56 78"
        class="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
        :class="errors?.customerPhone ? 'border-red-400 bg-red-50' : 'border-gray-300'"
      />
      <p v-if="errors?.customerPhone" class="text-xs text-red-600 mt-1">{{ errors.customerPhone }}</p>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-1">
      <AppButton type="submit" :loading="loading" class="flex-1">
        Envoyer
      </AppButton>
      <AppButton variant="ghost" type="button" @click="emit('cancel')">
        Annuler
      </AppButton>
    </div>
  </form>
</template>