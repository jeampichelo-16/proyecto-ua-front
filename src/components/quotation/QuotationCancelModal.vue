<template>
  <BaseModal :modelValue="isOpen" @update:modelValue="emit('cancel')" :hideCloseButton="isCancelling">
    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <XCircle class="w-5 h-5 text-red-600" />
        Cancelar Cotización
      </h2>

      <p class="text-sm text-gray-700">
        ¿Estás seguro que deseas cancelar esta cotización?
      </p>

      <div class="pt-4 border-t flex justify-end gap-2">
        <button
          v-if="!isCancelling"
          @click="emit('cancel')"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          No, volver
        </button>
        <button
          @click="emit('submit')"
          :disabled="isCancelling"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm disabled:opacity-50"
        >
          {{ isCancelling ? 'Cancelando...' : 'Sí, cancelar' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'
import BaseModal from '../BaseModal.vue'

defineProps<{
  isOpen: boolean
  isCancelling: boolean
}>()

const emit = defineEmits(['cancel', 'submit'])
</script>
