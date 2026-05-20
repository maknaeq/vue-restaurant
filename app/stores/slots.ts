import type { SlotResponse } from '../../../backend/types_pour_le_frontend'

export const useSlotsStore = defineStore('slots', () => {
  const api = useApi()

  const slots = ref<SlotResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSlots(restaurantId: string, date: string) {
    loading.value = true
    error.value = null
    try {
      slots.value = await api.get<SlotResponse[]>(`/restaurants/${restaurantId}/slots`, { date })
    } catch (err: any) {
      error.value = err.data?.message ?? 'Erreur lors du chargement des créneaux'
    } finally {
      loading.value = false
    }
  }

  return { slots, loading, error, fetchSlots }
})