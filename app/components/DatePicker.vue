<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const days = computed(() => {
  const result = []
  const today = new Date()
  for (let i = 0; i < 10; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
    result.push({ iso, label })
  }
  return result
})
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="day in days"
      :key="day.iso"
      type="button"
      :class="[
        'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize',
        props.modelValue === day.iso
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600',
      ]"
      @click="emit('update:modelValue', day.iso)"
    >
      {{ day.label }}
    </button>
  </div>
</template>