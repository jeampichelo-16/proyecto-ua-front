<template>
  <BaseModal :modelValue="isOpen" :hideCloseButton="isSubmitting" @update:modelValue="$emit('close')">
    <div class="space-y-6">
      <!-- Encabezado -->
      <div class="flex justify-between items-center border-b pb-2">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Detalles del Empleado</h2>
          <p class="text-sm text-gray-500">Información del registro seleccionado.</p>
        </div>
        <button v-if="!isEditable" @click="toggleEdit"
          class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-1.5 rounded shadow-sm">
          Editar
        </button>
      </div>

      <!-- VISTA LECTURA -->
      <template v-if="!isEditable">
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-700">
          <!-- Nombre y correo -->
          <div>
            <dt class="font-medium text-gray-500">Nombre completo</dt>
            <dd class="mt-1">{{ employee?.firstName }} {{ employee?.lastName }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500">Correo electrónico</dt>
            <dd class="mt-1 break-words w-full text-gray-800">
              {{ employee?.email }}
            </dd>
          </div>

          <!-- DNI y Teléfono -->
          <div>
            <dt class="font-medium text-gray-500">DNI</dt>
            <dd class="mt-1">{{ employee?.dni }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500">Teléfono</dt>
            <dd class="mt-1">{{ employee?.phone }}</dd>
          </div>

          <!-- Usuario y Rol -->
          <div>
            <dt class="font-medium text-gray-500">Usuario</dt>
            <dd class="mt-1">{{ employee?.username }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500">Rol</dt>
            <dd class="mt-1 uppercase">{{ employee?.role }}</dd>
          </div>

          <!-- Estado -->
          <div>
            <dt class="font-medium text-gray-500">Estado</dt>
            <dd class="mt-1">
              <span :class="employee?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="inline-block px-2 py-1 text-xs font-semibold rounded-full">
                {{ employee?.isActive ? 'Activo' : 'Inactivo' }}
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

      <!-- VISTA EDICIÓN -->
      <template v-else>
        <EmployeeEditSection :modelValue="form" :employeeId="employee!.id" @updated="onUpdated" @cancel="toggleEdit" />
      </template>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '../../BaseModal.vue'
import EmployeeEditSection from './EmployeeEditSection.vue'
import type { Employee, UpdateEmployeeDto } from '../../../types/employee'

const props = defineProps<{
  isOpen: boolean
  employee: Employee | null
}>()

const emit = defineEmits(['close', 'updated'])

const isEditable = ref(false)
const isSubmitting = ref(false)

const form = ref<UpdateEmployeeDto>({
  firstName: '',
  lastName: '',
  username: '',
  dni: '',
  phone: '',
  isActive: true
})

watch(
  () => props.employee,
  (emp) => {
    if (emp) {
      form.value = {
        firstName: emp.firstName,
        lastName: emp.lastName,
        username: emp.username,
        dni: emp.dni,
        phone: emp.phone,
        isActive: emp.isActive
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
