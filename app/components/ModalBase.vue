<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  subtitle?: string
}>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-40 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
          <button
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg leading-none p-1"
            @click="$emit('close')"
          >
            ✕
          </button>
          <h2 class="text-xl font-semibold text-gray-900 pr-8">{{ title }}</h2>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
          <div class="mt-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>