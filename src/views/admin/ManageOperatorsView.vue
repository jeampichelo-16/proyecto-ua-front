<template>
  <div class="p-6 space-y-6">
    <BaseDataTable :columns="columns" :items="filteredOperators">
      <!-- Cabecera -->
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Operarios</h1>

          <button @click="isCreateModalOpen = true"
            class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">
            <PlusCircle class="w-4 h-4" />
            Registrar Operario
          </button>
        </div>
        <div class="space-y-1 text-sm text-gray-600 leading-relaxed">
          <p>Administra los usuarios de tipo operario registrados en la plataforma.</p>
        </div>
      </template>

      <!-- Filtro -->
      <template #filters>
        <div class="w-full max-w-sm">
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, usuario o correo..."
            class="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm" />
        </div>
      </template>

      <!-- Filas -->
      <template #row="{ items }">
        <tr v-for="op in items" :key="op.id" class="hover:bg-yellow-50 transition duration-150">
          <td class="px-6 py-3">{{ op.firstName }} {{ op.lastName }}</td>
          <td class="px-6 py-3">{{ op.email }}</td>
          <td class="px-6 py-3">{{ op.dni }}</td>
          <td class="px-6 py-3">
            <span :class="[
              'inline-block px-2 py-1 text-xs font-semibold rounded-full',
              op.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              {{ op.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
            <div class="flex gap-2 items-center">
              <button @click="viewOperator(op)" class="flex items-center gap-1 text-blue-600 hover:underline text-xs">
                <Eye class="w-4 h-4" /> Ver
              </button>
              <button @click="requestDeleteOperator(op)"
                class="flex items-center gap-1 text-red-600 hover:underline text-xs">
                <Trash2 class="w-4 h-4" /> Eliminar
              </button>
            </div>
          </td>
        </tr>
      </template>

      <!-- Paginación -->
      <template #pagination>
        <BasePagination :currentPage="currentPage" :totalPages="totalPages" :hasNextPage="operators.length === pageSize"
          @update:page="currentPage = $event" />
      </template>
    </BaseDataTable>

    <!-- Modales -->
    <OperatorDetailModal :isOpen="isModalOpen" :operator="selectedOperator" @close="isModalOpen = false" />

    <OperatorDeleteModal :isOpen="isDeleteModalOpen" :operator="operatorToDelete" :isDeleting="isDeleting"
      @close="isDeleteModalOpen = false" @confirm="confirmDeleteOperator" />

    <OperatorCreateModal :isOpen="isCreateModalOpen" @close="isCreateModalOpen = false" @created="fetchOperators" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Operator } from '../../types/operator'
import {
  deleteOperatorById,
  getOperatorById,
  getPaginatedOperators
} from '../../services/admin.service'

import { notifyError, notifySuccess } from '../../utils/notify'

import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'

import OperatorDetailModal from '../../components/operators/OperatorDetailModal.vue'
import OperatorDeleteModal from '../../components/operators/OperatorDeleteModal.vue'
import OperatorCreateModal from '../../components/operators/OperatorCreateModal.vue'

import { Eye, PlusCircle, Trash2 } from 'lucide-vue-next'

const operators = ref<Operator[]>([])
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')

const selectedOperator = ref<Operator | null>(null)
const operatorToDelete = ref<Operator | null>(null)

const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isCreateModalOpen = ref(false)
const isDeleting = ref(false)

const columns = [
  { label: 'Nombre completo', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'DNI', key: 'dni' },
  { label: 'Estado', key: 'status' },
  { label: 'Acciones', key: 'actions' }
]

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredOperators = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return operators.value.filter(op =>
    op.firstName.toLowerCase().includes(q) ||
    op.lastName.toLowerCase().includes(q) ||
    op.username.toLowerCase().includes(q) ||
    op.email.toLowerCase().includes(q)
  )
})

async function fetchOperators() {
  try {
    const res = await getPaginatedOperators(currentPage.value)
    operators.value = res.users
    total.value = res.total
    pageSize.value = res.pageSize
  } catch (error) {
    console.error('Error al cargar operarios:', error)
  }
}

async function viewOperator(op: Operator) {
  try {
    const res = await getOperatorById(op.idOperator)
    selectedOperator.value = res
    isModalOpen.value = true
  } catch (err) {
    console.error('Error al cargar detalles del operario:', err)
  }
}

async function confirmDeleteOperator() {
  if (!operatorToDelete.value) return
  isDeleting.value = true
  try {
    await deleteOperatorById(operatorToDelete.value.idOperator)
    notifySuccess({ title: 'Operario eliminado', description: 'El operario fue eliminado correctamente.' })
    isDeleteModalOpen.value = false
    operatorToDelete.value = null
    await fetchOperators()
  } catch (error) {
    notifyError({ title: 'Error al eliminar', description: 'No se pudo eliminar el operario.' })
  } finally {
    isDeleting.value = false
  }
}

function requestDeleteOperator(operator: Operator) {
  operatorToDelete.value = operator
  isDeleteModalOpen.value = true
}

watch(currentPage, fetchOperators)
onMounted(fetchOperators)
</script>
