<script setup lang="ts">
const route = useRoute()
const reservationsStore = useReservationsStore()

const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
const cancelling = ref(false)
const confirmingCancel = ref(false)

const token = computed(() => route.query.token as string | undefined)

onMounted(async () => {
  if (token.value) {
    await reservationsStore.fetchByToken(token.value)
  }
})

async function handleCancel() {
  if (!reservationsStore.reservation) return
  cancelling.value = true
  const result = await reservationsStore.cancel(
    reservationsStore.reservation.id,
    reservationsStore.reservation.token,
  )
  cancelling.value = false
  confirmingCancel.value = false
  if (result) {
    toast.value = { message: result.message, type: 'success' }
  } else if (reservationsStore.globalError) {
    toast.value = { message: reservationsStore.globalError, type: 'error' }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shrink-0">
      <div class="max-w-lg mx-auto flex items-center gap-3">
        <button
          class="text-gray-400 hover:text-gray-600 transition-colors p-1 -ml-1 rounded-lg"
          @click="navigateTo('/')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-gray-900">Ma réservation</h1>
      </div>
    </header>

    <main class="max-w-lg mx-auto w-full px-6 py-8 flex-1">

      <!-- Pas de token dans l'URL -->
      <div v-if="!token" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
        </div>
        <p class="text-gray-700 font-semibold">Lien invalide</p>
        <p class="text-gray-400 text-sm mt-1.5">Utilisez le lien reçu par email après votre réservation.</p>
        <button class="mt-5 text-sm text-indigo-600 hover:underline font-medium" @click="navigateTo('/')">
          Retour à l'accueil
        </button>
      </div>

      <!-- Chargement -->
      <div v-else-if="reservationsStore.loading" class="flex justify-center py-20">
        <div class="animate-spin h-9 w-9 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>

      <!-- Erreur (token invalide / introuvable) -->
      <div v-else-if="reservationsStore.globalError && !reservationsStore.reservation" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p class="text-red-600 font-semibold">{{ reservationsStore.globalError }}</p>
        <button class="mt-4 text-sm text-indigo-600 hover:underline" @click="navigateTo('/')">
          Retour à l'accueil
        </button>
      </div>

      <!-- Réservation trouvée -->
      <div v-else-if="reservationsStore.reservation" class="space-y-5">

        <!-- Status hero -->
        <div class="text-center pt-2">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3"
            :class="reservationsStore.reservation.status === 'confirmed' ? 'bg-green-100' : 'bg-red-100'"
          >
            <svg
              class="w-8 h-8"
              :class="reservationsStore.reservation.status === 'confirmed' ? 'text-green-600' : 'text-red-500'"
              fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
            >
              <path
                v-if="reservationsStore.reservation.status === 'confirmed'"
                stroke-linecap="round" stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                v-else
                stroke-linecap="round" stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">
            {{ reservationsStore.reservation.status === 'confirmed' ? 'Réservation confirmée' : 'Réservation annulée' }}
          </h2>
          <p v-if="reservationsStore.reservation.status === 'confirmed'" class="text-sm text-gray-500 mt-1">
            À bientôt chez {{ reservationsStore.reservation.restaurant.name }} !
          </p>
        </div>

        <ReservationDetails :reservation="reservationsStore.reservation">
          <template #actions>
            <div v-if="reservationsStore.reservation.status === 'confirmed'">
              <div v-if="confirmingCancel" class="space-y-3">
                <p class="text-sm text-center text-gray-500">Confirmer l'annulation de cette réservation ?</p>
                <div class="flex gap-2">
                  <AppButton variant="ghost" class="flex-1" @click="confirmingCancel = false">
                    Conserver
                  </AppButton>
                  <AppButton variant="danger" :loading="cancelling" class="flex-1" @click="handleCancel">
                    Confirmer
                  </AppButton>
                </div>
              </div>
              <AppButton v-else variant="danger" class="w-full" @click="confirmingCancel = true">
                Annuler la réservation
              </AppButton>
            </div>
          </template>
        </ReservationDetails>

      </div>

    </main>

    <!-- Toast -->
    <AppToast
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      @dismiss="toast = null"
    />

  </div>
</template>