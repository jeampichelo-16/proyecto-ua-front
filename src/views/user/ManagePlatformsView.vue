<template>
    <div class="p-6 space-y-6">
        <BaseDataTable :columns="columns" :items="filteredMachines">
            <!-- Header -->
            <template #header>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h1 class="text-2xl font-bold text-gray-800">Gestión de Plataformas</h1>
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
                        <span :class="[
                            'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                            machine.status === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        ]">
                            {{ machine.status }}
                        </span>
                    </td>
                    <td class="px-6 py-3 whitespace-nowrap text-sm">
                        <div class="flex gap-2">
                            <button @click="viewMachine(machine.serial)"
                                class="text-blue-600 hover:underline text-xs">Ver</button>
                            <!--<button @click="editMachine(machine.serial)"
                                class="text-yellow-600 hover:underline text-xs">Editar</button>
                            <button @click="deleteMachine(machine.serial)"
                                class="text-red-600 hover:underline text-xs">Eliminar</button>-->
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
        <BaseModal v-model="isModalOpen">
            <div class="space-y-6">
                <div class="border-b pb-2">
                    <h2 class="text-lg font-semibold text-gray-800">Detalles de la Plataforma</h2>
                    <p class="text-sm text-gray-500">Información completa del registro seleccionado.</p>
                </div>

                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
                    <template v-for="(field, index) in machineFields" :key="index">
                        <div :class="index">
                            <dt class="font-medium text-gray-500">{{ field.label }}</dt>
                            <dd v-if="!field.rawHtml">{{ field.value() }}</dd>
                            <dd v-else v-html="field.value()" />
                        </div>
                    </template>

                    <!-- Certificados -->
                    <div class="sm:col-span-2 space-y-2">
                        <div class="flex items-center gap-2">
                            <FileText class="w-4 h-4 text-gray-600" />
                            <span>Certificado de operatividad:</span>
                            <a :href="selectedMachine?.operativityCertificatePath" target="_blank"
                                class="text-blue-600 hover:underline">
                                Ver PDF
                            </a>
                        </div>
                        <div class="flex items-center gap-2">
                            <FileText class="w-4 h-4 text-gray-600" />
                            <span>Documento de propiedad:</span>
                            <a :href="selectedMachine?.ownershipDocumentPath" target="_blank"
                                class="text-indigo-600 hover:underline">
                                Ver PDF
                            </a>
                        </div>
                    </div>
                </dl>

                <div class="pt-4 border-t flex justify-end">
                    <button @click="isModalOpen = false"
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                        Cerrar
                    </button>
                </div>
            </div>
        </BaseModal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { getPaginatedMachines, getMachineBySerial } from '../../services/user.service'
import type { Machine } from '../../types/platform'
import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'
import BaseModal from '../../components/BaseModal.vue'
import { FileText } from 'lucide-vue-next'

// State
const machines = ref<Machine[]>([])
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedMachine = ref<Machine | null>(null)

// Columns
const columns = [
    { label: 'Marca', key: 'brand' },
    { label: 'Modelo', key: 'model' },
    { label: 'Tipo', key: 'typePlatform' },
    { label: 'Precio', key: 'price' },
    { label: 'Estado', key: 'status' },
    { label: 'Acciones', key: 'actions' },
]

// Mapeo dinámico para el modal
const machineFields = [
    { label: 'Serial', value: () => selectedMachine.value?.serial },
    { label: 'Marca', value: () => selectedMachine.value?.brand },
    { label: 'Modelo', value: () => selectedMachine.value?.model },
    { label: 'Tipo de Plataforma', value: () => selectedMachine.value?.typePlatform },
    { label: 'Precio', value: () => `S/ ${selectedMachine.value?.price}` },
    { label: 'Descripción', value: () => selectedMachine.value?.description },
    {
        label: 'Estado',
        value: () =>
            `<span class='px-2 py-1 rounded-full text-xs font-semibold ${selectedMachine.value?.status === 'ACTIVO'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }'>${selectedMachine.value?.status}</span>`,
        rawHtml: true,
    },
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

watch(currentPage, fetchMachines)
onMounted(fetchMachines)
</script>