<template>
  <div class="p-6 space-y-6">
    <BaseDataTable :columns="columns" :items="filteredEmployees">
      <!-- Cabecera -->
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Empleados</h1>
          <button @click="isCreateEmployeeModalOpen = true"
            class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">
            <PlusCircle class="w-4 h-4" />
            Registrar Empleado
          </button>
        </div>
        <div class="space-y-1 text-sm text-gray-600 leading-relaxed">
          <p>Administra los empleados registrados en la plataforma.</p>
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
            <div class="flex gap-2 items-center">
              <button @click="viewEmployee(emp)" class="text-blue-600 hover:underline text-xs flex items-center gap-1">
                <Eye class="w-4 h-4" /> Ver
              </button>
              <button @click="requestDeleteEmployee(emp)"
                class="text-red-600 hover:underline text-xs flex items-center gap-1">
                <Trash2 class="w-4 h-4" /> Eliminar
              </button>
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

    <!-- Modales -->
    <EmployeeDetailModal :isOpen="isModalOpen" :employee="selectedEmployee" @close="isModalOpen = false"
      @updated="fetchEmployees" />
    <CreateEmployeeModal :isOpen="isCreateEmployeeModalOpen" @close="isCreateEmployeeModalOpen = false"
      @created="fetchEmployees" />
    <ConfirmEmployeeDeleteModal :isOpen="isDeleteModalOpen" :employee="employeeToDelete" :isDeleting="isDeleting"
      @close="isDeleteModalOpen = false" @confirm="confirmDeleteEmployee" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Employee } from '../../types/employee'
import {
  getEmployeeById,
  getPaginatedEmployees,
  deleteEmployeeById
} from '../../services/admin.service'

import { notifySuccess, notifyError } from '../../utils/notify'

import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'

import CreateEmployeeModal from '../../components/modals/employee/EmployeeCreateModal.vue'
import EmployeeDetailModal from '../../components/modals/employee/EmployeeDetailModal.vue'
import ConfirmEmployeeDeleteModal from '../../components/modals/employee/EmployeeDeleteModal.vue'

import { PlusCircle, Eye, Trash2 } from 'lucide-vue-next'

const employees = ref<Employee[]>([])
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')

const isModalOpen = ref(false)
const selectedEmployee = ref<Employee | null>(null)

const isCreateEmployeeModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const employeeToDelete = ref<Employee | null>(null)

const columns = [
  { label: 'Nombre completo', key: 'name' },
  { label: 'Usuario', key: 'username' },
  { label: 'Email', key: 'email' },
  { label: 'Rol', key: 'role' },
  { label: 'Estado', key: 'status' },
  { label: 'Acciones', key: 'actions' }
]

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredEmployees = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return employees.value.filter((emp) =>
    [emp.firstName, emp.lastName, emp.username, emp.email].some((val) =>
      val.toLowerCase().includes(q)
    )
  )
})

async function fetchEmployees() {
  try {
    const res = await getPaginatedEmployees(currentPage.value)
    employees.value = res.users
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

function requestDeleteEmployee(emp: Employee) {
  employeeToDelete.value = emp
  isDeleteModalOpen.value = true
}

async function confirmDeleteEmployee() {
  if (!employeeToDelete.value) return
  isDeleting.value = true
  try {
    await deleteEmployeeById(employeeToDelete.value.id)
    notifySuccess({ title: 'Empleado eliminado', description: 'Empleado eliminado correctamente.' })
    isDeleteModalOpen.value = false
    employeeToDelete.value = null
    await fetchEmployees()
  } catch (err) {
    notifyError({ title: 'Error al eliminar', description: 'No se pudo eliminar el empleado.' })
  } finally {
    isDeleting.value = false
  }
}

watch(currentPage, fetchEmployees)
onMounted(fetchEmployees)
</script>
