<template>
    <div class="p-6 space-y-6">
        <BaseDataTable :columns="columns" :items="filteredClients">
            <!-- 🧭 Cabecera -->
            <template #header>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h1 class="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>

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
                    <td v-for="column in columns" :key="column.key"
                        class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
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
                                <button @click="viewClient(client)" class="text-blue-600 hover:underline text-xs">
                                    Ver
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

        <BaseModal v-model="isModalOpen">
            <div class="space-y-6">
                <div class="border-b pb-2">
                    <h2 class="text-xl font-semibold text-gray-800">Detalles del Cliente</h2>
                    <p class="text-sm text-gray-500">Información completa del cliente seleccionado.</p>
                </div>

                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
                    <template v-for="(field, index) in clientFields" :key="index">
                        <div :class="index">
                            <dt class="font-medium text-gray-500">{{ field.label }}</dt>
                            <dd v-if="!field.html">{{ field.value }}</dd>
                            <dd v-else v-html="field.value" />
                        </div>
                    </template>
                </dl>

                <div class="pt-4 border-t flex justify-end">
                    <button @click="isModalOpen = false"
                        class="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition">Cerrar</button>
                </div>
            </div>
        </BaseModal>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Client } from '../../types/client'
import { getClientById, getPaginatedClients } from '../../services/user.service'
import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'
import BaseModal from '../../components/BaseModal.vue'

// Columnas dinámicas
const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'RUC', key: 'ruc' },
    { label: 'Razón Social', key: 'companyName' },
    { label: 'Teléfono', key: 'phone' },
    { label: 'Dirección', key: 'address' },
    { label: 'Estado', key: 'isActive' },
    { label: 'Acciones', key: 'actions' },
]

const clientFields = computed(() => [
    { label: 'Nombre', value: selectedClient.value?.name },
    { label: 'Correo electrónico', value: selectedClient.value?.email },
    { label: 'RUC', value: selectedClient.value?.ruc },
    { label: 'Razón Social', value: selectedClient.value?.companyName },
    { label: 'Teléfono', value: selectedClient.value?.phone },
    { label: 'Dirección', value: selectedClient.value?.address },
    {
        label: 'Estado',
        html: true,
        value: `<span class="px-2 py-0.5 text-xs rounded-full font-medium ${selectedClient.value?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }">
      ${selectedClient.value?.isActive ? 'Activo' : 'Inactivo'}
    </span>`
    },
])

// State
const clients = ref<Client[]>([])
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedClient = ref<Client | null>(null)

// Cálculo de páginas
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// Filtrado por texto
const filteredClients = computed(() => {
    if (!searchQuery.value.trim()) return clients.value
    const q = searchQuery.value.toLowerCase()
    return clients.value.filter(
        (c) =>
            c.name.toLowerCase().includes(q) ||
            c.ruc.toLowerCase().includes(q)
    )
})

// Fetch paginado
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

async function viewClient(client: Client) {
    try {
        selectedClient.value = await getClientById(client.id)
        isModalOpen.value = true
    } catch (error) {
        console.error('Error al obtener cliente:', error)
    }
}

watch(currentPage, fetchClients)
onMounted(fetchClients)
</script>