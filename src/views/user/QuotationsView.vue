<template>
    <div class="p-6 space-y-6">
        <BaseDataTable :columns="columns" :items="filteredQuotations">

            <!-- Header -->
            <template #header>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h1 class="text-2xl font-bold text-gray-800">Gestión de Cotizaciones</h1>
                    <button @click="isCreateModalOpen = true"
                        class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">
                        <PlusCircle class="w-4 h-4" />
                        Generar Cotización
                    </button>
                </div>
            </template>

            <!-- Filas -->
            <template #row="{ items }">
                <tr v-for="q in items" :key="q.id" class="hover:bg-yellow-50 transition duration-150">
                    <td class="px-6 py-3">{{ q.clientName }}</td>
                    <td class="px-6 py-3">{{ q.platformSerial }}</td>
                    <td class="px-6 py-3">{{ q.days }} días</td>
                    <td class="px-6 py-3">S/ {{ q.total.toFixed(2) }}</td>
                    <td class="px-6 py-3">
                        <span :class="[
                            'inline-block px-2 py-0.5 text-xs font-semibold rounded-full',
                            q.status === 'APROBADO'
                                ? 'bg-green-100 text-green-700'
                                : q.status === 'RECHAZADO'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                        ]">
                            {{ q.status }}
                        </span>
                    </td>
                    <td class="px-6 py-3 text-sm text-gray-500">{{ formatDate(q.createdAt) }}</td>
                    <td class="px-6 py-3 text-xs text-gray-700">
                        <div class="flex items-center gap-2">
                            <button @click="viewQuotation(q.id)"
                                class="flex items-center gap-1 text-blue-600 hover:underline">
                                <Eye class="w-4 h-4" /> Ver
                            </button>
                            <button v-if="q.status === 'PENDIENTE'" @click="openApproveModal(q.id)"
                                class="flex items-center gap-1 text-green-600 hover:underline">
                                <CheckCircle class="w-4 h-4" /> Aprobar
                            </button>
                            <button v-if="q.status === 'PENDIENTE'" @click="submitCancellation(q.id)"
                                class="flex items-center gap-1 text-red-600 hover:underline">
                                <XCircle class="w-4 h-4" />
                                Cancelar
                            </button>
                        </div>
                    </td>

                </tr>
            </template>

            <!-- Paginación -->
            <template #pagination>
                <BasePagination :currentPage="currentPage" :totalPages="totalPages"
                    :hasNextPage="quotations.length === pageSize" @update:page="currentPage = $event" />
            </template>
        </BaseDataTable>

        <!-- Modal de creación -->
        <BaseModal v-model="isCreateModalOpen" :hideCloseButton="isCreating">
            <div class="space-y-4">
                <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <PlusCircle class="w-5 h-5 text-yellow-500" />
                    Nueva Cotización
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <label class="block mb-1 text-gray-700">Cliente</label>
                        <select v-model="createForm.clientId" :disabled="isCreating"
                            class="w-full border rounded px-3 py-2">
                            <option disabled value="">Seleccione</option>
                            <option v-for="c in activeClients" :key="c.id" :value="c.id">{{ c.companyName }}</option>
                        </select>
                    </div>

                    <div>
                        <label class="block mb-1 text-gray-700">Plataforma</label>
                        <select v-model="createForm.platformId" :disabled="isCreating"
                            class="w-full border rounded px-3 py-2">
                            <option disabled value="">Seleccione</option>
                            <option v-for="p in activePlatforms" :key="p.id" :value="p.id">
                                {{ p.serial }} ({{ p.brand }} - {{ p.model }})
                            </option>
                        </select>
                    </div>

                    <div class="sm:col-span-2">
                        <label class="block mb-1 text-gray-700">Descripción</label>
                        <textarea v-model="createForm.description" :disabled="isCreating"
                            class="w-full border rounded px-3 py-2" rows="3"></textarea>
                    </div>

                    <div>
                        <label class="block mb-1 text-gray-700">Días</label>
                        <input v-model="createForm.days" type="number" min="1" :disabled="isCreating"
                            class="w-full border rounded px-3 py-2" />
                    </div>

                    <div class="flex items-center space-x-2">
                        <input v-model="createForm.isNeedOperator" type="checkbox" :disabled="isCreating"
                            id="need-operator" class="text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded" />
                        <label for="need-operator" class="text-sm text-gray-700">¿Requiere operador?</label>
                    </div>
                </div>

                <!-- Footer -->
                <div class="text-right pt-4 border-t">
                    <button v-if="!isCreating" @click="isCreateModalOpen = false"
                        class="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 mr-2">
                        Cancelar
                    </button>
                    <button @click="submitNewQuotation" :disabled="isCreating"
                        class="px-4 py-2 text-sm rounded bg-yellow-400 text-white hover:bg-yellow-500 disabled:opacity-60">
                        {{ isCreating ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </BaseModal>


        <!-- Modal Detalles -->
        <BaseModal v-model="isModalOpen">
            <div class="space-y-6">
                <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardList class="w-5 h-5 text-yellow-500" />
                    Detalles de Cotización
                </h2>

                <!-- Cliente & Correo -->
                <section class="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div class="flex items-start gap-2">
                        <User class="w-4 h-4 mt-1 text-gray-500" />
                        <p><span class="font-medium">Cliente:</span> {{ selectedQuotation?.client.name }}</p>
                    </div>
                    <div class="flex items-start gap-2">
                        <Mail class="w-4 h-4 mt-1 text-gray-500" />
                        <p class="break-words max-w-full truncate sm:whitespace-normal">
                            <strong>Correo:</strong> {{ selectedQuotation?.client.email }}
                        </p>
                    </div>
                </section>

                <!-- Plataforma & Días -->
                <section class="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div class="flex items-start gap-2">
                        <Wrench class="w-4 h-4 mt-1 text-gray-500" />
                        <p>
                            <span class="font-medium">Plataforma:</span>
                            {{ selectedQuotation?.platform.serial }}
                            ({{ selectedQuotation?.platform.brand }} - {{ selectedQuotation?.platform.model }})
                        </p>
                    </div>
                    <div class="flex items-start gap-2">
                        <Calendar class="w-4 h-4 mt-1 text-gray-500" />
                        <p><span class="font-medium">Días:</span> {{ selectedQuotation?.days }}</p>
                    </div>
                </section>

                <!-- Montos -->
                <section class="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div class="flex gap-2 items-start">
                        <DollarSign class="w-4 h-4 mt-1 text-gray-500" />
                        <div class="space-y-1 text-sm text-gray-700 leading-tight">
                            <div>
                                <span class="font-medium">Monto:</span>
                                {{ selectedQuotation?.typeCurrency }} {{ selectedQuotation?.amount != null ?
                                    selectedQuotation.amount.toFixed(2) : '0.00' }}
                            </div>
                            <div>
                                <span class="font-medium">Envío:</span>
                                {{ selectedQuotation?.typeCurrency }} {{ selectedQuotation?.deliveryAmount != null ?
                                    selectedQuotation.deliveryAmount.toFixed(2) : '0.00' }}
                            </div>
                            <div>
                                <span class="font-medium">Subtotal:</span>
                                {{ selectedQuotation?.typeCurrency }} {{ selectedQuotation?.subtotal != null ?
                                    selectedQuotation.subtotal.toFixed(2) : '0.00' }}
                            </div>
                            <div>
                                <span class="font-medium">IGV:</span>
                                {{ selectedQuotation?.typeCurrency }} {{ selectedQuotation?.igv != null ?
                                    selectedQuotation.igv.toFixed(2) : '0.00' }}
                            </div>
                            <div class="font-medium">
                                Total: {{ selectedQuotation?.typeCurrency }} {{ selectedQuotation?.total != null ?
                                    selectedQuotation.total.toFixed(2) : '0.00' }}
                            </div>
                        </div>
                    </div>
                </section>


                <!-- Estado & Fecha -->
                <section class="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div class="flex items-center gap-2">
                        <ClipboardList class="w-4 h-4 text-gray-500" />
                        <p><span class="font-medium">Estado:</span> {{ selectedQuotation?.status }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <Calendar class="w-4 h-4 text-gray-500" />
                        <p><span class="font-medium">Fecha:</span> {{ formatDate(selectedQuotation?.createdAt ?? '') }}
                        </p>
                    </div>
                </section>

                <!-- PDF -->
                <section v-if="selectedQuotation?.quotationPath" class="flex items-center gap-2 text-sm text-gray-700">
                    <FileText class="w-4 h-4 text-gray-600" />
                    <span class="font-medium">PDF:</span>
                    <a :href="selectedQuotation?.quotationPath" target="_blank" class="text-blue-600 hover:underline">
                        Ver documento
                    </a>
                </section>

                <!-- Footer -->
                <div class="text-right pt-4 border-t">
                    <button @click="isModalOpen = false"
                        class="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200">
                        Cerrar
                    </button>
                </div>
            </div>
        </BaseModal>


        <BaseModal v-model="isApproveModalOpen" :hideCloseButton="isApproving">

            <div class="space-y-4">
                <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <CheckCircle class="w-5 h-5 text-green-600" />
                    Aprobar Cotización
                </h2>

                <p class="text-sm text-gray-600">Completa los datos para aprobar esta cotización.</p>

                <div>
                    <label class="block text-sm text-gray-700 font-medium mb-1">Costo de Envío (S/)</label>
                    <input type="number" v-model="deliveryCost" :disabled="isApproving"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-400 focus:ring-2" />
                </div>

                <div v-if="selectedQuotation?.isNeedOperator">
                    <label class="block text-sm text-gray-700 font-medium mb-1">Seleccionar Operador</label>
                    <select v-if="selectedQuotation?.isNeedOperator" v-model="selectedOperatorId"
                        :disabled="isApproving"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-400 focus:ring-2">
                        <option value="" disabled selected>Selecciona un operador</option>
                        <option v-for="op in availableOperators" :key="op.id" :value="op.id">
                            {{ op.fullName }}
                        </option>
                    </select>

                </div>

                <div class="pt-4 border-t flex justify-end gap-2">
                    <button v-if="!isApproving" @click="isApproveModalOpen = false"
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                        Cancelar
                    </button>
                    <button @click="submitApproval" :disabled="isApproving"
                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:opacity-50">
                        {{ isApproving ? 'Aprobando...' : 'Aprobar' }}
                    </button>
                </div>

            </div>
        </BaseModal>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Quotation } from '../../types/quotation'
import type { QuotationDetail } from '../../types/quotationDetail'
import { getPaginatedQuotations, getQuotationById, approveQuotation, getAvailableOperators, getActivePlatforms, getActiveClients, createQuotation } from '../../services/user.service'
import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'
import BaseModal from '../../components/BaseModal.vue'
import { FileText, Calendar, DollarSign, XCircle, User, Mail, ClipboardList, Wrench, CheckCircle, Eye, PlusCircle } from 'lucide-vue-next'
import { notifyError, notifySuccess } from '../../utils/notify'
import { cancelQuotation } from '../../services/user.service'

const quotations = ref<Quotation[]>([])
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedQuotation = ref<QuotationDetail | null>(null)

const isModalOpen = ref(false)
const isApproveModalOpen = ref(false)
const isCreateModalOpen = ref(false)

const approveQuotationId = ref<number | null>(null)
const deliveryCost = ref<number | null>(null)
const selectedOperatorId = ref<number | null>(null)
const availableOperators = ref<{ id: number; fullName: string }[]>([])
const isApproving = ref(false)
const isCreating = ref(false)

// 🆕 Nueva cotización
const createForm = ref({
    clientId: null as number | null,
    platformId: null as number | null,
    description: '',
    days: 1,
    isNeedOperator: false,
})
const activeClients = ref<{ id: number; companyName: string }[]>([])
const activePlatforms = ref<{ id: number; serial: string; brand: string; model: string }[]>([])


const columns = [
    { label: 'Cliente', key: 'clientName' },
    { label: 'Plataforma', key: 'platformSerial' },
    { label: 'Días', key: 'days' },
    { label: 'Total', key: 'total' },
    { label: 'Estado', key: 'status' },
    { label: 'Fecha', key: 'createdAt' },
    { label: 'Acciones', key: 'actions' }
]

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredQuotations = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return quotations.value.filter(
        (item) =>
            item.clientName.toLowerCase().includes(q) ||
            item.platformSerial.toLowerCase().includes(q)
    )
})

async function fetchActiveData() {
    try {
        const clients = await getActiveClients()
        const platforms = await getActivePlatforms()
        activeClients.value = clients
        activePlatforms.value = platforms
    } catch (err) {
        console.error('Error al cargar datos activos:', err)
    }
}

async function submitNewQuotation() {
    const form = createForm.value;

    if (!form.clientId || !form.platformId || !form.description.trim() || form.days <= 0) {
        notifyError({
            title: 'Campos incompletos',
            description: 'Completa todos los campos obligatorios correctamente.',
        });
        return;
    }

    isCreating.value = true

    try {
        await createQuotation({
            clientId: form.clientId,
            platformId: form.platformId,
            description: form.description.trim(),
            days: form.days,
            isNeedOperator: form.isNeedOperator,
        });

        notifySuccess({
            title: 'Cotización creada',
            description: 'La cotización se ha creado exitosamente.',
        });

        isCreateModalOpen.value = false;
        await fetchQuotations();

        // Opcional: limpiar el formulario
        createForm.value = {
            clientId: null,
            platformId: null,
            description: '',
            days: 1,
            isNeedOperator: false,
        };
    } catch (err) {
        notifyError({
            title: 'Error al crear cotización',
            description: 'No se pudo crear la cotización. Por favor, inténtalo de nuevo más tarde.',
        });
    } finally {
        isCreating.value = false
    }
}


function formatDate(date: string) {
    return new Date(date).toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short'
    })
}

async function fetchQuotations() {
    try {
        const res = await getPaginatedQuotations(currentPage.value)
        quotations.value = res.quotations
        total.value = res.total
        pageSize.value = res.pageSize
    } catch (err) {
        console.error('Error al obtener cotizaciones:', err)
    }
}

async function viewQuotation(id: number) {
    try {
        const data = await getQuotationById(id)
        selectedQuotation.value = data
        isModalOpen.value = true
    } catch (err) {
        console.error('Error al obtener detalle de cotización:', err)
    }
}

async function loadOperators() {
    try {
        availableOperators.value = await getAvailableOperators()
    } catch (err) {
        console.error('Error al obtener operadores:', err)
    }
}

async function openApproveModal(id: number) {
    try {
        const data = await getQuotationById(id)
        selectedQuotation.value = data
        approveQuotationId.value = id
        deliveryCost.value = null
        selectedOperatorId.value = null
        isApproveModalOpen.value = true

        if (data.isNeedOperator) {
            await loadOperators()
        }
    } catch (err) {
        console.error('Error al preparar aprobación:', err)
    }
}

async function submitApproval() {
    if (!deliveryCost.value || deliveryCost.value <= 0) {
        notifyError({
            title: 'Costo inválido',
            description: 'Por favor, ingresa un costo de envío válido.',
        });
        return;
    }

    if (selectedQuotation.value?.isNeedOperator && !selectedOperatorId.value) {
        notifyError({
            title: 'Operador requerido',
            description: 'Por favor, selecciona un operador.',
        });
        return;
    }

    isApproving.value = true;

    try {
        await approveQuotation({
            quotationId: approveQuotationId.value!,
            deliveryAmount: deliveryCost.value!,
            operatorId: selectedQuotation.value?.isNeedOperator ? selectedOperatorId.value : null
        });

        notifySuccess({
            title: 'Cotización aprobada',
            description: 'La cotización fue aprobada correctamente.',
        });

        isApproveModalOpen.value = false;
        await fetchQuotations();
    } catch (err) {
        notifyError({
            title: 'Error al aprobar',
            description: 'Ocurrió un error al aprobar la cotización.',
        });
    } finally {
        isApproving.value = false;
    }
}

async function submitCancellation(id: number) {
    try {
        await cancelQuotation(id)
        notifySuccess({
            title: 'Cotización cancelada',
            description: 'La cotización ha sido cancelada correctamente.',
        })
        await fetchQuotations()
    } catch (err) {
        notifyError({
            title: 'Error al cancelar',
            description: 'No se pudo cancelar la cotización. Intenta nuevamente.',
        })
    }
}


watch([currentPage, selectedStatus], fetchQuotations)
onMounted(() => {
    fetchQuotations()
    fetchActiveData()
})
</script>
