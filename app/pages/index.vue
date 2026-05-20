<script setup lang="ts">
const restaurantsStore = useRestaurantsStore()

onMounted(() => {
  restaurantsStore.fetchAll()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-6 py-5">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900">Restaurants</h1>
        <p class="text-sm text-gray-500 mt-1">Choisissez un restaurant pour réserver une table</p>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="restaurantsStore.loading" class="flex justify-center py-20">
        <div class="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>

      <!-- Error -->
      <div v-else-if="restaurantsStore.error" class="text-center py-20">
        <p class="text-red-600 font-medium">{{ restaurantsStore.error }}</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <RestaurantCard
          v-for="r in restaurantsStore.list"
          :key="r.id"
          :restaurant="r"
          @click="navigateTo('/restaurants/' + r.id)"
        />
      </div>
    </main>
  </div>
</template>