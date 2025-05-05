<template>
  <BaseModal :modelValue="isOpen" @update:modelValue="emit('close')" :hideCloseButton="isSubmitting" maxWidth="lg">
    <div class="space-y-6">
      <!-- Encabezado -->
      <div class="flex justify-between items-center border-b pb-3">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Detalles de la Plataforma</h2>
          <p class="text-sm text-gray-500">Información completa del registro seleccionado.</p>
        </div>
        <button v-if="!isEditing" @click="toggleEdit"
          class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-1.5 rounded shadow-sm">
          Editar
        </button>
      </div>

      <!-- Vista de detalles -->
      <template v-if="!isEditing">
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <div>
            <dt class="font-medium text-gray-500">Serial</dt>
            <dd class="text-gray-900">{{ machine?.serial }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500">Marca</dt>
            <dd class="text-gray-900">{{ machine?.brand }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500">Modelo</dt>
            <dd class="text-gray-900">{{ machine?.model }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500">Tipo de Plataforma</dt>
            <dd class="text-gray-900">{{ machine?.typePlatform }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500">Precio</dt>
            <dd class="text-gray-900">S/ {{ machine?.price }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500">Estado</dt>
            <dd v-html="statusBadge" />
          </div>
          <div class="sm:col-span-2">
            <dt class="font-medium text-gray-500">Descripción</dt>
            <dd class="text-gray-900 whitespace-pre-line">{{ machine?.description }}</dd>
          </div>
        </dl>

        <!-- Certificados -->
        <div class="space-y-3 pt-4 border-t">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <FileText class="w-4 h-4 text-gray-500" />
            <span>Certificado de operatividad:</span>
            <a :href="machine?.operativityCertificatePath" target="_blank"
              class="text-blue-600 hover:underline flex items-center gap-1">
              <Eye class="w-4 h-4" /> Ver PDF
            </a>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <FileText class="w-4 h-4 text-gray-500" />
            <span>Documento de propiedad:</span>
            <a :href="machine?.ownershipDocumentPath" target="_blank"
              class="text-indigo-600 hover:underline flex items-center gap-1">
              <Eye class="w-4 h-4" /> Ver PDF
            </a>
          </div>
        </div>

        <!-- Botón cerrar -->
        <div class="pt-5 border-t flex justify-end">
          <button @click="emit('close')" class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
            Cerrar
          </button>
        </div>
      </template>

      <!-- Edición -->
      <PlatformEditSection v-else :machine="machine" @updated="handleUpdated" @cancel="toggleEdit"
        @submitting="isSubmitting = $event" />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

import PlatformEditSection from './PlatformEditSection.vue'
import { FileText, Eye } from 'lucide-vue-next'
import type { Machine, MachineStatus } from '../../../types/platform';
import { getMachineStatusBadgeClass, getMachineStatusLabel } from '../../../utils/machineStatusUtils';
import BaseModal from '../../../components/BaseModal.vue'

const props = defineProps<{
  isOpen: boolean
  machine: Machine | null
}>()

const emit = defineEmits(['close', 'updated'])

const isEditing = ref(false)
const isSubmitting = ref(false)

function toggleEdit() {
  isEditing.value = !isEditing.value
}

function handleUpdated() {
  emit('updated')
  emit('close')
}

watch(() => props.isOpen, (open) => {
  if (!open) {
    isEditing.value = false
    isSubmitting.value = false
  }
})

const statusBadge = computed(() => {
  if (!props.machine?.status) return ''
  const label = getMachineStatusLabel(props.machine.status as MachineStatus)
  const cls = getMachineStatusBadgeClass(props.machine.status as MachineStatus)
  return `<span class='inline-block px-2 py-1 rounded-full text-xs font-semibold ${cls}'>${label}</span>`
})
</script>
