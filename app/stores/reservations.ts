import type { CreateReservation, ReservationResponse, CancelResponse } from '../../../backend/types_pour_le_frontend'

export const useReservationsStore = defineStore('reservations', () => {
  const api = useApi()

  const reservation = ref<ReservationResponse | null>(null)
  const cancelMessage = ref<string | null>(null)
  const loading = ref(false)
  const fieldErrors = ref<Record<string, string>>({})
  const globalError = ref<string | null>(null)

  function clearErrors() {
    fieldErrors.value = {}
    globalError.value = null
  }

  async function create(dto: CreateReservation) {
    loading.value = true
    clearErrors()
    try {
      reservation.value = await api.post<ReservationResponse>('/reservations', dto)
      return reservation.value
    } catch (err: any) {
      const apiErr = err.data
      if (apiErr?.field) {
        fieldErrors.value[apiErr.field] = apiErr.message
      } else {
        globalError.value = apiErr?.message ?? 'Une erreur est survenue'
      }
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchByToken(token: string) {
    loading.value = true
    clearErrors()
    try {
      reservation.value = await api.get<ReservationResponse>(`/reservations/by-token/${token}`)
    } catch (err: any) {
      globalError.value = err.data?.message ?? 'Réservation introuvable'
    } finally {
      loading.value = false
    }
  }

  async function cancel(id: string, token: string) {
    loading.value = true
    clearErrors()
    try {
      const result = await api.patch<CancelResponse>(`/reservations/${id}/cancel`, { token })
      cancelMessage.value = result.message
      reservation.value = result.reservation
      return result
    } catch (err: any) {
      globalError.value = err.data?.message ?? "Erreur lors de l'annulation"
      return null
    } finally {
      loading.value = false
    }
  }

  return { reservation, cancelMessage, loading, fieldErrors, globalError, create, fetchByToken, cancel, clearErrors }
})