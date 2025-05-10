<template>
    <BaseModal :modelValue="isOpen" @update:modelValue="emit('close')" :hideCloseButton="isSubmitting" >
        <div class="space-y-6">
            <div class="border-b pb-2 flex justify-between items-center">
                <div>
                    <h2 class="text-lg font-semibold text-gray-800">Detalles del Operario</h2>
                    <p class="text-sm text-gray-500">Información del registro seleccionado</p>
                </div>
                <button v-if="!isEditing" @click="enableEdit"
                    class="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Editar</button>
            </div>

            <div v-if="!isEditing">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div v-for="(field, index) in operatorFields" :key="index" class="space-y-1">
                        <dt class="font-medium text-gray-500">{{ field.label }}</dt>
                        <dd v-if="!field.rawHtml" class="break-words text-gray-800">{{ field.value() }}</dd>
                        <dd v-else v-html="field.value()" />
                    </div>
                    <div class="sm:col-span-2 space-y-2">
                        <dt class="font-medium text-gray-500">Certificados</dt>
                        <div class="flex items-center gap-2">
                            <FileText class="w-4 h-4 text-gray-600" />
                            <span>Certificado de operatividad:</span>
                            <a v-if="operator?.operativityCertificatePath" :href="operator.operativityCertificatePath"
                                target="_blank" class="text-blue-600 hover:underline text-sm">Ver PDF</a>
                        </div>
                        <div class="flex items-center gap-2">
                            <FileText class="w-4 h-4 text-gray-600" />
                            <span>Examen médico ocupacional (EMO):</span>
                            <a v-if="operator?.emoPDFPath" :href="operator.emoPDFPath" target="_blank"
                                class="text-blue-600 hover:underline text-sm">Ver PDF</a>
                        </div>
                    </div>
                </dl>
                <div class="pt-4 border-t flex justify-end">
                    <button @click="emit('close')"
                        class="px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200">Cerrar</button>
                </div>
            </div>

            <!-- Edición -->
            <OperatorEditSection v-else :operator="operator" @updated="handleUpdated" @cancel="cancelEdit"
                @submitting="isSubmitting = $event" />
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '../../BaseModal.vue'
import OperatorEditSection from './OperatorEditSection.vue'
import { FileText } from 'lucide-vue-next'
import type { Operator } from '../../../types/operator'
import {
  getOperatorStatusBadgeClass,
  getOperatorStatusLabel
} from '../../../utils/operatorStatusUtils' // ✅ Ajusta el path si es necesario

const props = defineProps<{ isOpen: boolean; operator: Operator | null }>()

const emit = defineEmits(['close', 'updated'])

const isEditing = ref(false)
const isSubmitting = ref(false)

function enableEdit() {
  isEditing.value = true
}
function cancelEdit() {
  isEditing.value = false
}
function handleUpdated() {
  emit('updated')
  emit('close')
}

const operatorFields = computed(() => [
  {
    label: 'Nombre completo',
    value: () => `${props.operator?.firstName ?? ''} ${props.operator?.lastName ?? ''}`
  },
  { label: 'Correo electrónico', value: () => props.operator?.email ?? '' },
  { label: 'DNI', value: () => props.operator?.dni ?? '' },
  { label: 'Teléfono', value: () => props.operator?.phone ?? '' },
  { label: 'Rol', value: () => props.operator?.role?.toUpperCase() ?? '' },
  {
    label: 'Estado',
    rawHtml: true,
    value: () => {
      const status = props.operator?.operatorStatus
      const label = getOperatorStatusLabel(status!)
      const cls = getOperatorStatusBadgeClass(status!)
      return `<span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}">${label}</span>`
    }
  },
  {
    label: 'Costo del servicio',
    value: () => props.operator?.costService ? `S/. ${props.operator.costService}` : ''
  }
])

watch(() => props.isOpen, (open) => {
  if (!open) {
    isEditing.value = false
  }
})
</script>
