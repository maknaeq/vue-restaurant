<script setup lang="ts">
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function dec() {
  if (props.modelValue > 1) emit('update:modelValue', props.modelValue - 1)
}
function inc() {
  if (props.modelValue < 20) emit('update:modelValue', props.modelValue + 1)
}
</script>

<template>
  <div class="inline-flex items-center gap-3">
    <button
      type="button"
      class="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      :disabled="modelValue <= 1"
      @click="dec"
    >
      −
    </button>
    <span class="text-xl font-semibold w-7 text-center tabular-nums select-none">{{ modelValue }}</span>
    <button
      type="button"
      class="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      :disabled="modelValue >= 20"
      @click="inc"
    >
      +
    </button>
    <span class="text-sm text-gray-500">personne{{ modelValue > 1 ? 's' : '' }}</span>
  </div>
</template>