<script setup lang="ts">
const props = defineProps<{
  message: string
  type?: 'success' | 'error'
}>()
const emit = defineEmits<{ dismiss: [] }>()

onMounted(() => {
  setTimeout(() => emit('dismiss'), 5000)
})
</script>

<template>
  <div
    class="fixed bottom-5 right-5 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm max-w-sm"
    :class="props.type === 'error' ? 'bg-red-600' : 'bg-green-600'"
  >
    <span class="flex-1 leading-snug">{{ message }}</span>
    <button class="shrink-0 hover:opacity-75 leading-none mt-0.5" @click="emit('dismiss')">✕</button>
  </div>
</template>