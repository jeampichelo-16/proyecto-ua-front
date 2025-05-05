<template>
  <BaseModal :modelValue="isOpen" @update:modelValue="$emit('cancel')" :hideCloseButton="isApproving">
    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <CheckCircle class="w-5 h-5 text-green-600" />
        Aprobar Cotización
      </h2>

      <p class="text-sm text-gray-600">Completa los datos para aprobar esta cotización.</p>

      <!-- Costo de Envío -->
      <div>
        <label class="block text-sm text-gray-700 font-medium mb-1">Costo de Envío (S/)</label>
        <input type="number" v-model="deliveryCost" :disabled="isApproving"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-400 focus:ring-2" />
      </div>

      <!-- Operador (si es requerido) -->
      <div v-if="quotation?.isNeedOperator">
        <label class="block text-sm text-gray-700 font-medium mb-1">Seleccionar Operador</label>
        <select v-model="selectedOperatorId" :disabled="isApproving"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-400 focus:ring-2">
          <option value="" disabled selected>Selecciona un operador</option>
          <option v-for="op in availableOperators" :key="op.id" :value="op.id">
            {{ op.fullName }}
          </option>
        </select>
      </div>

      <!-- Footer -->
      <div class="pt-4 border-t flex justify-end gap-2">
        <button v-if="!isApproving" @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">
          Cancelar
        </button>
        <button @click="handleSubmit" :disabled="isApproving"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:opacity-50">
          {{ isApproving ? 'Aprobando...' : 'Aprobar' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '../../BaseModal.vue'
import { CheckCircle } from 'lucide-vue-next'
import type { QuotationDetail } from '../../../types/quotation';

const props = defineProps<{
  isOpen: boolean
  quotation: QuotationDetail | null
  isApproving: boolean
  availableOperators: { id: number; fullName: string }[]
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit', payload: { deliveryAmount: number; operatorId: number | null }): void
}>()

const deliveryCost = ref<number | null>(null)
const selectedOperatorId = ref<number | null>(null)

watch(
  () => props.quotation,
  () => {
    deliveryCost.value = null
    selectedOperatorId.value = null
  }
)

function handleSubmit() {
  if (!deliveryCost.value || deliveryCost.value <= 0) {
    alert('Por favor, ingresa un costo de envío válido.')
    return
  }

  if (props.quotation?.isNeedOperator && !selectedOperatorId.value) {
    alert('Por favor, selecciona un operador.')
    return
  }

  emit('submit', {
    deliveryAmount: deliveryCost.value,
    operatorId: props.quotation?.isNeedOperator ? selectedOperatorId.value : null,
  })
}
</script>