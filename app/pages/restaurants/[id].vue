<script setup lang="ts">
import type { SlotResponse, CreateReservation } from '../../../../backend/types_pour_le_frontend'

interface FormErrors {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  global?: string
}

const route = useRoute()
const restaurantsStore = useRestaurantsStore()
const slotsStore = useSlotsStore()
const reservationsStore = useReservationsStore()

const id = route.params.id as string
const today = new Date().toISOString().slice(0, 10)

const selectedDate = ref(today)
const covers = ref(2)
const selectedSlot = ref<SlotResponse | null>(null)
const showForm = ref(false)
const confirmed = ref(false)
const tokenUrl = ref('')

onMounted(async () => {
  await restaurantsStore.fetchById(id)
  await loadSlots()
})

watch(selectedDate, loadSlots)

async function loadSlots() {
  selectedSlot.value = null
  await slotsStore.fetchSlots(id, selectedDate.value)
}

function openForm(slot: SlotResponse) {
  selectedSlot.value = slot
  showForm.value = true
  reservationsStore.clearErrors()
}

const formErrors = computed<FormErrors>(() => ({
  customerName: reservationsStore.fieldErrors.customerName,
  customerEmail: reservationsStore.fieldErrors.customerEmail,
  customerPhone: reservationsStore.fieldErrors.customerPhone,
  global: reservationsStore.fieldErrors.covers ?? reservationsStore.globalError ?? undefined,
}))

async function submitReservation(dto: CreateReservation) {
  const result = await reservationsStore.create(dto)
  if (result) {
    showForm.value = false
    confirmed.value = true
    tokenUrl.value = `${window.location.origin}/reservations?token=${result.token}`
    await loadSlots()
  }
}

async function copyToken() {
  await navigator.clipboard.writeText(tokenUrl.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- Header plein-largeur -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shrink-0">
      <div class="max-w-5xl mx-auto flex items-center gap-3">
        <button
          class="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          @click="navigateTo('/')"
        >
          ← Retour
        </button>
        <h1 class="text-lg font-semibold text-gray-900 truncate">
          {{ restaurantsStore.current?.name ?? '…' }}
        </h1>
      </div>
    </header>

    <!-- Corps : image gauche + contenu droite -->
    <div class="flex items-center justify-between gap-6 flex-1 p-3">

      <!-- Gauche : image -->
      <div class="h-full">
          <img
            v-if="restaurantsStore.current"
            :src="restaurantsStore.current.imageUrl"
            :alt="restaurantsStore.current.name"
            class="w-full h-52 md:h-80 object-cover rounded-2xl shadow-sm"
          />
      </div>

      <!-- Droite : infos + réservation -->
      <div class="space-y-10">

        <!-- Infos restaurant -->
        <div v-if="restaurantsStore.current">
          <p class="text-indigo-600 font-semibold text-sm">{{ restaurantsStore.current.cuisineType }}</p>
          <p class="text-gray-600 mt-2 text-sm leading-relaxed">{{ restaurantsStore.current.description }}</p>
          <p class="text-gray-400 text-xs mt-2">{{ restaurantsStore.current.address }}</p>
        </div>

        <!-- Séparateur -->
        <div class="border-t border-gray-200" />

        <!-- Réservation -->
        <div class="space-y-5">
          <h2 class="text-base font-semibold text-gray-900">Réservation</h2>

          <!-- Date -->
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date</p>
            <DatePicker v-model="selectedDate" />
          </div>

          <!-- Personnes -->
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Personnes</p>
            <PersonCountInput v-model="covers" />
          </div>

          <!-- Horaires -->
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Horaires</p>
            <div v-if="slotsStore.loading" class="flex justify-center py-8">
              <div class="animate-spin h-7 w-7 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
            <SlotGrid
              v-else
              :slots="slotsStore.slots"
              :selected-slot-id="selectedSlot?.id"
              @select="openForm"
            />
          </div>
        </div>

        <!-- Confirmation après réservation -->
        <div v-if="confirmed" class="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p class="font-semibold text-green-800">Réservation confirmée !</p>
          <p class="text-sm text-green-700 mt-1">
            Conservez ce lien pour retrouver ou annuler votre réservation :
          </p>
          <div class="mt-3 flex gap-2">
            <input
              :value="tokenUrl"
              readonly
              class="flex-1 text-xs bg-white border border-green-300 rounded-xl px-3 py-2 truncate focus:outline-none"
            />
            <AppButton variant="ghost" @click="copyToken">Copier</AppButton>
          </div>
          <NuxtLink
            :to="'/reservations?token=' + reservationsStore.reservation?.token"
            class="mt-3 block text-sm text-indigo-600 hover:underline"
          >
            Voir ma réservation →
          </NuxtLink>
        </div>

      </div>
    </div>

    <!-- Modal formulaire de réservation -->
    <ModalBase
      v-if="selectedSlot && restaurantsStore.current"
      :open="showForm"
      title="Réservation"
      @close="showForm = false"
    >
      <ReservationForm
        :slot="selectedSlot"
        :restaurant="restaurantsStore.current"
        :covers="covers"
        :loading="reservationsStore.loading"
        :errors="formErrors"
        @submit="submitReservation"
        @cancel="showForm = false"
      />
    </ModalBase>

  </div>
</template>