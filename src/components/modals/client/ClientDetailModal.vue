<template>
  <BaseModal :modelValue="isOpen" :hideCloseButton="isSubmitting" @update:modelValue="$emit('close')">
    <div class="space-y-6">
      <!-- Encabezado -->
      <div class="flex justify-between items-center border-b pb-2">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Detalles del Cliente</h2>
          <p class="text-sm text-gray-500">Información completa del cliente seleccionado.</p>
        </div>
        <button
          v-if="!isEditable"
          @click="toggleEdit"
          class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-1.5 rounded shadow-sm"
        >
          Editar
        </button>
      </div>

      <!-- Vista Lectura -->
      <template v-if="!isEditable">
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <div><dt class="font-medium text-gray-500">Nombre</dt><dd class="mt-1">{{ client?.name }}</dd></div>
          <div><dt class="font-medium text-gray-500">Correo</dt><dd class="mt-1 break-words">{{ client?.email }}</dd></div>
          <div><dt class="font-medium text-gray-500">Teléfono</dt><dd class="mt-1">{{ client?.phone }}</dd></div>
          <div><dt class="font-medium text-gray-500">RUC</dt><dd class="mt-1">{{ client?.ruc }}</dd></div>
          <div><dt class="font-medium text-gray-500">Razón Social</dt><dd class="mt-1">{{ client?.companyName }}</dd></div>
          <div><dt class="font-medium text-gray-500">Dirección</dt><dd class="mt-1">{{ client?.address }}</dd></div>
          <div>
            <dt class="font-medium text-gray-500">Estado</dt>
            <dd class="mt-1">
              <span
                :class="client?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="inline-block px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ client?.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </dd>
          </div>
        </dl>

        <!-- Footer -->
        <div class="pt-6 border-t flex justify-end">
          <button @click="$emit('close')" class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
            Cerrar
          </button>
        </div>
      </template>

      <!-- Vista Edición -->
      <template v-else>
        <ClientEditSection
          :modelValue="form"
          :clientId="client!.id"
          @updated="onUpdated"
          @cancel="toggleEdit"
          @submitting="isSubmitting = $event"
        />
      </template>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '../../BaseModal.vue'
import ClientEditSection from './ClientEditSection.vue'
import type { Client, UpdateClientDto } from '../../../types/client'

const props = defineProps<{
  isOpen: boolean
  client: Client | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const isEditable = ref(false)
const isSubmitting = ref(false)

const form = ref<UpdateClientDto>({
  name: '',
  phone: '',
  email: '',
  companyName: '',
  address: '',
  isActive: true
})

watch(
  () => props.client,
  (c) => {
    if (c) {
      form.value = {
        name: c.name,
        phone: c.phone,
        email: c.email,
        companyName: c.companyName,
        address: c.address,
        isActive: c.isActive
      }
      isEditable.value = false
    }
  },
  { immediate: true }
)

function toggleEdit() {
  isEditable.value = !isEditable.value
}

function onUpdated() {
  emit('updated')
  emit('close')
}
</script>
