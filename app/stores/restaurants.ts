import type { Restaurant } from '../../../backend/types_pour_le_frontend'

export const useRestaurantsStore = defineStore('restaurants', () => {
  const api = useApi()

  const list = ref<Restaurant[]>([])
  const current = ref<Restaurant | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      list.value = await api.get<Restaurant[]>('/restaurants')
    } catch (err: any) {
      error.value = err.data?.message ?? 'Erreur lors du chargement des restaurants'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    error.value = null
    try {
      current.value = await api.get<Restaurant>(`/restaurants/${id}`)
    } catch (err: any) {
      error.value = err.data?.message ?? 'Restaurant introuvable'
    } finally {
      loading.value = false
    }
  }

  return { list, current, loading, error, fetchAll, fetchById }
})