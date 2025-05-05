<template>
    <div class="p-6 space-y-6">
        <BaseDataTable :columns="columns" :items="filteredMachines">
            <!-- Header -->
            <template #header>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h1 class="text-2xl font-bold text-gray-800">Gestión de Plataformas</h1>

                    <button @click="isCreateModalOpen = true"
                        class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">
                        <PlusCircle class="w-4 h-4" />
                        Registrar Plataforma
                    </button>
                </div>

                <div class="space-y-1 text-sm text-gray-600 leading-relaxed">
                    <p>Administra los registros de plataformas disponibles en la base de datos.</p>
                </div>
            </template>

            <!-- Filtro -->
            <template #filters>
                <div class="w-full max-w-sm">
                    <input v-model="searchQuery" type="text" placeholder="Buscar por marca o modelo..."
                        class="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm" />
                </div>
            </template>

            <!-- Filas -->
            <template #row="{ items }">
                <tr v-for="machine in items" :key="machine.serial" class="hover:bg-yellow-50 transition duration-150">
                    <td class="px-6 py-3">{{ machine.brand }}</td>
                    <td class="px-6 py-3">{{ machine.model }}</td>
                    <td class="px-6 py-3">{{ machine.typePlatform }}</td>
                    <td class="px-6 py-3">S/ {{ machine.price }}</td>
                    <td class="px-6 py-3">
                        <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold"
                            :class="getMachineStatusBadgeClass(machine.status)">
                            {{ getMachineStatusLabel(machine.status) }}
                        </span>
                    </td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm">
                        <div class="flex gap-2">
                            <button @click="viewMachine(machine.serial)"
                                class="flex items-center gap-1 text-blue-600 hover:underline text-xs">
                                <Eye class="w-4 h-4" /> Ver
                            </button>

                            <button @click="requestDeleteMachine(machine)"
                                class="flex items-center gap-1 text-red-600 hover:underline text-xs">
                                <Trash2 class="w-4 h-4" /> Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            </template>

            <!-- Paginación -->
            <template #pagination>
                <BasePagination :currentPage="currentPage" :totalPages="totalPages"
                    :hasNextPage="machines.length === pageSize" @update:page="currentPage = $event" />
            </template>
        </BaseDataTable>

        <!-- Modal de Detalles -->
        <PlatformDetailsModal :isOpen="isModalOpen" :machine="selectedMachine" @close="isModalOpen = false"
            @updated="handleMachineUpdated" />
        <PlatformDeleteModal :isOpen="isDeleteModalOpen" :isDeleting="isDeleting" :machine="machineToDelete"
            @close="isDeleteModalOpen = false" @confirm="confirmDeleteMachine" />
        <PlatformCreateModal :isOpen="isCreateModalOpen" @close="isCreateModalOpen = false" @created="fetchMachines" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { getPaginatedMachines, getMachineBySerial } from '../../services/user.service'
import type { Machine } from '../../types/platform'
import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'
import { PlusCircle, Trash2, Eye } from 'lucide-vue-next'
import { getMachineStatusBadgeClass, getMachineStatusLabel } from '../../utils/machineStatusUtils'
import PlatformCreateModal from '../../components/modals/platform/PlatformCreateModal.vue'
import PlatformDetailsModal from '../../components/modals/platform/PlatformDetailsModal.vue'
import PlatformDeleteModal from '../../components/modals/platform/PlatformDeleteModal.vue'
import { notifyError, notifySuccess } from '../../utils/notify'
import { deletePlatformBySerial } from '../../services/admin.service'

// State
const machines = ref<Machine[]>([])
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedMachine = ref<Machine | null>(null)
const isCreateModalOpen = ref(false)
const machineToDelete = ref<Machine | null>(null)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)

// Columns
const columns = [
    { label: 'Marca', key: 'brand' },
    { label: 'Modelo', key: 'model' },
    { label: 'Tipo', key: 'typePlatform' },
    { label: 'Precio', key: 'price' },
    { label: 'Estado', key: 'status' },
    { label: 'Acciones', key: 'actions' },
]

// Filtro
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredMachines = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return machines.value.filter((m) =>
        `${m.brand} ${m.model}`.toLowerCase().includes(q)
    )
})

// Fetch inicial
async function fetchMachines() {
    try {
        const res = await getPaginatedMachines(currentPage.value)
        machines.value = res.machines
        total.value = res.total
        pageSize.value = res.pageSize
    } catch (err) {
        console.error('Error al obtener plataformas:', err)
    }
}

// Ver detalles por serial
async function viewMachine(serial: string) {
    try {
        const res = await getMachineBySerial(serial)
        selectedMachine.value = res
        isModalOpen.value = true
    } catch (err) {
        console.error('Error al obtener detalles de la máquina:', err)
    }
}

function requestDeleteMachine(machine: Machine) {
    machineToDelete.value = machine
    isDeleteModalOpen.value = true
}

async function confirmDeleteMachine() {
    if (!machineToDelete.value) return
    isDeleting.value = true
    try {
        await deletePlatformBySerial(machineToDelete.value.serial)
        notifySuccess({ title: 'Plataforma eliminada', description: 'Se eliminó correctamente.' })
        isDeleteModalOpen.value = false
        machineToDelete.value = null
        await fetchMachines()
    } catch (err) {
        notifyError({ title: 'Error', description: 'No se pudo eliminar la plataforma.' })
    } finally {
        isDeleting.value = false
    }
}

async function handleMachineUpdated() {
    isModalOpen.value = false
    selectedMachine.value = null
    await fetchMachines() // <- ¡Esto recarga la tabla!
}

watch(currentPage, fetchMachines)
onMounted(fetchMachines)
</script>