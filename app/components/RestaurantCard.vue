<script setup lang="ts">
import type { Restaurant } from '../../../backend/types_pour_le_frontend'

defineProps<{ restaurant: Restaurant }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    @click="$emit('click')"
  >
    <img
      :src="restaurant.imageUrl"
      :alt="restaurant.name"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 text-base leading-snug">{{ restaurant.name }}</h3>
      <p class="text-sm text-indigo-600 font-medium mt-1">{{ restaurant.cuisineType }}</p>
      <p class="text-sm text-gray-400 mt-1 truncate">{{ restaurant.address }}</p>
    </div>
  </div>
</template>