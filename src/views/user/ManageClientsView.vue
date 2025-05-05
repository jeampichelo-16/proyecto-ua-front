<template>
    <div class="p-6 space-y-6">
      <BaseDataTable :columns="columns" :items="filteredClients">
        <!-- 🧭 Cabecera -->
        <template #header>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h1 class="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
            <button @click="isCreateModalOpen = true"
              class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">
              <PlusCircle class="w-4 h-4" />
              Registrar Cliente
            </button>
          </div>
          <div class="space-y-1 text-sm text-gray-600 leading-relaxed">
            <p>Administra los clientes registrados en la plataforma.</p>
          </div>
        </template>
  
        <!-- 🔎 Filtros -->
        <template #filters>
          <div class="w-full max-w-sm">
            <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o RUC..."
              class="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm" />
          </div>
        </template>
  
        <!-- 📄 Filas -->
        <template #row="{ items }">
          <tr v-for="client in items" :key="client.id" class="hover:bg-yellow-50 transition duration-150">
            <td v-for="column in columns" :key="column.key" class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
              <!-- Estado -->
              <template v-if="column.key === 'isActive'">
                <span :class="[
                  'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                  client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ client.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </template>
  
              <!-- Acciones -->
              <template v-else-if="column.key === 'actions'">
                <div class="flex gap-2">
                  <button @click="viewClient(client)" class="flex items-center gap-1 text-blue-600 hover:underline text-xs">
                    <Eye class="w-4 h-4" /> Ver
                  </button>
                  <button @click="requestDeleteClient(client)" class="flex items-center gap-1 text-red-600 hover:underline text-xs">
                    <Trash2 class="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </template>
  
              <!-- General -->
              <template v-else>
                {{ client[column.key] }}
              </template>
            </td>
          </tr>
        </template>
  
        <!-- 📦 Paginación -->
        <template #pagination>
          <BasePagination :currentPage="currentPage" :totalPages="totalPages"
            :hasNextPage="clients.length === pageSize" @update:page="currentPage = $event" />
        </template>
      </BaseDataTable>
  
      <!-- Modales -->
      <ClientDetailModal
        :isOpen="isModalOpen"
        :client="selectedClient"
        :isSubmitting="isSubmitting"
        @close="isModalOpen = false"
        @updated="fetchClients"
        @submitting="isSubmitting = $event"
      />
  
      <ClientDeleteModal
        :isOpen="isDeleteModalOpen"
        :isDeleting="isDeleting"
        :client="clientToDelete"
        @close="isDeleteModalOpen = false"
        @confirm="confirmDeleteClient"
      />
  
      <ClientCreateModal
        :isOpen="isCreateModalOpen"
        @close="isCreateModalOpen = false"
        @created="handleClientCreated"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue'
  import type { Client } from '../../types/client'
  import {
    getPaginatedClients,
    getClientById,
    deleteClientById
  } from '../../services/user.service'
  import { notifyError, notifySuccess } from '../../utils/notify'
  
  import BaseDataTable from '../../components/BaseDataTable.vue'
  import BasePagination from '../../components/BasePagination.vue'
  import ClientDetailModal from '../../components/modals/client/ClientDetailModal.vue'
  import ClientDeleteModal from '../../components/modals/client/ClientDeleteModal.vue'
  import ClientCreateModal from '../../components/modals/client/ClientCreateModal.vue'
  
  import { Eye, Trash2, PlusCircle } from 'lucide-vue-next'
  
  // 📄 Columnas
  const columns = [
    { label: 'RUC', key: 'ruc' },
    { label: 'Razón Social', key: 'companyName' },
    { label: 'Teléfono', key: 'phone' },
    { label: 'Estado', key: 'isActive' },
    { label: 'Acciones', key: 'actions' }
  ]
  
  // 📊 Estado
  const clients = ref<Client[]>([])
  const currentPage = ref(1)
  const total = ref(0)
  const pageSize = ref(10)
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const searchQuery = ref('')
  
  // 🔍 Filtro
  const filteredClients = computed(() => {
    if (!searchQuery.value.trim()) return clients.value
    const q = searchQuery.value.toLowerCase()
    return clients.value.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.ruc.toLowerCase().includes(q)
    )
  })
  
  // 👁 Modal de detalle
  const isModalOpen = ref(false)
  const selectedClient = ref<Client | null>(null)
  const isSubmitting = ref(false)
  
  // ➕ Modal de creación
  const isCreateModalOpen = ref(false)
  
  // 🗑 Modal de eliminación
  const isDeleteModalOpen = ref(false)
  const clientToDelete = ref<Client | null>(null)
  const isDeleting = ref(false)
  
  // 📦 Cargar clientes
  async function fetchClients() {
    try {
      const res = await getPaginatedClients(currentPage.value)
      clients.value = res.clients
      total.value = res.total
      pageSize.value = res.pageSize
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    }
  }
  
  // 👁 Ver cliente
  async function viewClient(client: Client) {
    try {
      selectedClient.value = await getClientById(client.id)
      isModalOpen.value = true
    } catch (error) {
      console.error('Error al obtener cliente:', error)
    }
  }
  
  // 🗑 Confirmar eliminación
  async function confirmDeleteClient() {
    if (!clientToDelete.value) return
    isDeleting.value = true
    try {
      await deleteClientById(clientToDelete.value.id)
      notifySuccess({ title: 'Cliente eliminado', description: 'El cliente fue eliminado correctamente.' })
      isDeleteModalOpen.value = false
      clientToDelete.value = null
      await fetchClients()
    } catch (error) {
      notifyError({ title: 'Error', description: 'No se pudo eliminar el cliente.' })
    } finally {
      isDeleting.value = false
    }
  }
  
  // 🧾 Preparar eliminación
  function requestDeleteClient(client: Client) {
    clientToDelete.value = client
    isDeleteModalOpen.value = true
  }
  
  // ✅ Cliente creado
  function handleClientCreated() {
    isCreateModalOpen.value = false
    fetchClients()
  }
  
  // 🔁 Fetch inicial y reactivo
  watch(currentPage, fetchClients)
  onMounted(fetchClients)
  </script>
  