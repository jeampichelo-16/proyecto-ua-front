<template>
  <transition name="fade">
    <div v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
      <!-- Contenedor modal -->
      <div
        class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200 sm:p-8">
        
        <!-- Botón cerrar con ícono Lucide -->
        <button
          v-if="!hideCloseButton"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          @click="$emit('update:modelValue', false)"
          aria-label="Cerrar modal">
          <X class="w-5 h-5" />
        </button>

        <!-- Slot de contenido -->
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  modelValue: boolean
  hideCloseButton?: boolean
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
