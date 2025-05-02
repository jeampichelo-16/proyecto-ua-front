<template>
  <div class="p-6 space-y-6">
    <BaseDataTable :columns="columns" :items="filteredEmployees">
      <!-- Cabecera -->
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        </div>
      </template>

      <!-- Filtro de búsqueda -->
      <template #filters>
        <div class="w-full max-w-sm">
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, usuario o correo..."
            class="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm" />
        </div>
      </template>

      <!-- Filas -->
      <template #row="{ items }">
        <tr v-for="emp in items" :key="emp.id" class="hover:bg-yellow-50 transition duration-150">
          <td class="px-6 py-3">{{ emp.firstName }} {{ emp.lastName }}</td>
          <td class="px-6 py-3">{{ emp.username }}</td>
          <td class="px-6 py-3">{{ emp.email }}</td>
          <td class="px-6 py-3 capitalize">{{ emp.role.toLowerCase() }}</td>
          <td class="px-6 py-3">
            <span :class="[
              'inline-block px-2 py-1 text-xs font-semibold rounded-full',
              emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              {{ emp.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
            <div class="flex gap-2">
              <button @click="viewEmployee(emp)" class="text-blue-600 hover:underline text-xs">Ver</button>
              <!--<button @click="editEmployee(emp)" class="text-yellow-600 hover:underline text-xs">Editar</button>
              <button @click="deleteEmployee(emp)" class="text-red-600 hover:underline text-xs">Eliminar</button>-->
            </div>
          </td>
        </tr>
      </template>

      <!-- Paginación -->
      <template #pagination>
        <BasePagination :currentPage="currentPage" :totalPages="totalPages" :hasNextPage="employees.length === pageSize"
          @update:page="currentPage = $event" />
      </template>



    </BaseDataTable>

    <BaseModal v-model="isModalOpen">
      <div class="space-y-6">
        <div class="border-b pb-2">
          <h2 class="text-xl font-semibold text-gray-800">Detalles del Empleado</h2>
          <p class="text-sm text-gray-500">Información completa del usuario seleccionado.</p>
        </div>

        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <template v-for="(field, index) in employeeFields" :key="index">
            <div :class="index">
              <dt class="font-medium text-gray-500">{{ field.label }}</dt>
              <dd v-if="!field.html">{{ field.value }}</dd>
              <dd v-else v-html="field.value" />
            </div>
          </template>
        </dl>


        <div class="pt-4 border-t flex justify-end">
          <button @click="isModalOpen = false"
            class="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200">Cerrar</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Employee } from '../../types/employee'
import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'
import { getEmployeeById, getPaginatedEmployees } from '../../services/admin.service'
import BaseModal from '../../components/BaseModal.vue'

const employees = ref<Employee[]>([])
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedEmployee = ref<Employee | null>(null)

const columns = [
  { label: 'Nombre completo', key: 'name' },
  { label: 'Usuario', key: 'username' },
  { label: 'Email', key: 'email' },
  { label: 'Rol', key: 'role' },
  { label: 'Estado', key: 'status' },
  { label: 'Acciones', key: 'actions' }
]

const employeeFields = computed(() => [
  {
    label: 'Nombre completo',
    value: `${selectedEmployee.value?.firstName} ${selectedEmployee.value?.lastName}`
  },
  {
    label: 'Usuario',
    value: selectedEmployee.value?.username
  },
  {
    label: 'Correo',
    value: selectedEmployee.value?.email
  },
  {
    label: 'DNI',
    value: selectedEmployee.value?.dni
  },
  {
    label: 'Teléfono',
    value: selectedEmployee.value?.phone
  },
  {
    label: 'Rol',
    value: selectedEmployee.value?.role?.toLowerCase()
  },
  {
    label: 'Estado',
    html: true,
    value: `<span class="px-2 py-1 rounded-full text-xs font-semibold ${selectedEmployee.value?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }">
      ${selectedEmployee.value?.isActive ? 'Activo' : 'Inactivo'}
    </span>`
  }
])


const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredEmployees = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return employees.value.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.username.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
  )
})

async function fetchEmployees() {
  try {
    const res = await getPaginatedEmployees(currentPage.value)
    employees.value = res.users // ✅ aquí
    total.value = res.total
    pageSize.value = res.pageSize
  } catch (error) {
    console.error('Error al cargar empleados:', error)
  }
}

async function viewEmployee(emp: Employee) {
  try {
    const full = await getEmployeeById(emp.id)
    selectedEmployee.value = full
    isModalOpen.value = true
  } catch (err) {
    console.error('Error al cargar detalles del empleado:', err)
  }
}

watch(currentPage, fetchEmployees)
onMounted(fetchEmployees)
</script>