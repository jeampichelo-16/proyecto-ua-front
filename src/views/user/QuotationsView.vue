<template>
  <div class="p-6 space-y-6">
    <BaseDataTable :columns="columns" :items="filteredQuotations">
      <!-- Header -->
      <template #header>
        <div class="space-y-4">
          <!-- Título -->
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Gestión de Cotizaciones</h1>
            <p class="text-sm text-gray-600">Administra las cotizaciones generadas por los clientes.</p>
          </div>

          <!-- Buscador + Botón Generar -->
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <!-- Buscador y acciones -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
              <input v-model="searchInput" type="text" placeholder="Buscar por código de cotización..."
                class="border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded px-3 py-2 text-sm w-full sm:w-72 transition"
                @keyup.enter="handleSearchQuotation" />

              <button @click="handleSearchQuotation"
                class="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition">
                Buscar
              </button>

              <button v-if="isSearching" @click="cancelSearch"
                class="bg-gray-200 text-gray-800 px-4 py-2 text-sm rounded hover:bg-gray-300 transition">
                Cancelar
              </button>
            </div>

            <!-- Botón Generar Cotización -->
            <div class="flex justify-end">
              <button @click="isCreateModalOpen = true"
                class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">
                <PlusCircle class="w-4 h-4" />
                Generar Cotización
              </button>
            </div>
          </div>
        </div>
      </template>


      <!-- Filas -->
      <template #row="{ items }">
        <tr v-for="q in items" :key="q.id" class="hover:bg-yellow-50 transition duration-150">
          <td class="px-6 py-3">{{ q.codeQuotation }}</td>
          <td class="px-6 py-3">{{ formatDate(q.startDate) }}</td>
          <td class="px-6 py-3">{{ formatDate(q.endDate) }}</td>
          <td class="px-6 py-3">
            <span v-html="getStatusBadge(q.status)"></span>
          </td>
          <td class="px-6 py-3 text-sm text-gray-500">{{ formatDate(q.createdAt) }}</td>
          <td class="px-6 py-3 text-xs text-gray-700">
            <div class="flex items-center gap-2">
              <button @click="viewQuotation(q.id)" class="flex items-center gap-1 text-blue-600 hover:underline">
                <Eye class="w-4 h-4" /> Ver
              </button>

              <button v-if="q.status === 'PENDIENTE_DATOS'" @click="openApproveModal(q.id)"
                class="flex items-center gap-1 text-green-600 hover:underline">
                <CheckCircle class="w-4 h-4" /> Aprobar
              </button>

              <button v-if="q.status === 'PENDIENTE_PAGO'" @click="openPayModal(q.id)"
                class="flex items-center gap-1 text-emerald-600 hover:underline">
                <DollarSign class="w-4 h-4" /> Pagar
              </button>

              <button v-if="q.status !== 'PAGADO' && q.status !== 'RECHAZADO'" @click="confirmCancellation(q.id)"
                class="flex items-center gap-1 text-red-600 hover:underline">
                <XCircle class="w-4 h-4" /> Cancelar
              </button>
            </div>
          </td>
        </tr>
      </template>

      <!-- Paginación -->
      <template #pagination>
        <BasePagination v-if="!isSearching" :currentPage="currentPage" :totalPages="totalPages"
          :hasNextPage="quotations.length === pageSize" @update:page="currentPage = $event" />
      </template>
    </BaseDataTable>

    <!-- Modales -->
    <QuotationCreateModal v-model:isOpen="isCreateModalOpen" :clients="activeClients" :platforms="activePlatforms"
      @created="fetchQuotations" @cancel="isCreateModalOpen = false" />

    <QuotationDetailModal :isOpen="isModalOpen" :quotation="selectedQuotation" @close="isModalOpen = false" />

    <QuotationApproveModal :isOpen="isApproveModalOpen" :quotation="selectedQuotation"
      :availableOperators="availableOperators" :isApproving="isApproving" @cancel="isApproveModalOpen = false"
      @submit="handleApproval" />

    <QuotationCancelModal :isOpen="isCancelConfirmOpen" :isCancelling="isCancelling"
      @cancel="isCancelConfirmOpen = false" @submit="submitCancellation" />

    <QuotationPayModal :isOpen="isPayModalOpen" :quotationId="payQuotationId" @close="isPayModalOpen = false"
      @paid="onPaidSuccessfully" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { PlusCircle, Eye, CheckCircle, XCircle, DollarSign } from 'lucide-vue-next'
import {
  getPaginatedQuotations,
  getQuotationById,
  approveQuotation,
  getAvailableOperators,
  getActiveClients,
  getActivePlatforms,
  cancelQuotation,
  searchQuotationByCode
} from '../../services/user.service'
import { notifyError, notifySuccess } from '../../utils/notify'
import { formatDate } from '../../utils/date'

import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'
import QuotationCreateModal from '../../components/modals/quotation/QuotationCreateModal.vue'
import QuotationDetailModal from '../../components/modals/quotation/QuotationDetailModal.vue'
import QuotationApproveModal from '../../components/modals/quotation/QuotationApproveModal.vue'
import QuotationCancelModal from '../../components/modals/quotation/QuotationCancelModal.vue'
import QuotationPayModal from '../../components/modals/quotation/QuotationPayModal.vue'

import type { Quotation, QuotationDetail } from '../../types/quotation'
import { getQuotationStatusBadgeClass, getQuotationStatusLabel } from '../../utils/quotationStatusUtils'

const quotations = ref<Quotation[]>([])
const selectedQuotation = ref<QuotationDetail | null>(null)

const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const selectedStatus = ref('')

const searchInput = ref('')
const isSearching = ref(false)

const isCreateModalOpen = ref(false)
const isModalOpen = ref(false)
const isApproveModalOpen = ref(false)
const isCancelConfirmOpen = ref(false)
const isPayModalOpen = ref(false)

type LoadingState = 'none' | 'approving' | 'cancelling'
const loadingState = ref<LoadingState>('none')
const isApproving = computed(() => loadingState.value === 'approving')
const isCancelling = computed(() => loadingState.value === 'cancelling')

const approveQuotationId = ref<number | null>(null)
const payQuotationId = ref<number>(0)
const cancelQuotationId = ref<number | null>(null)

const availableOperators = ref<{ id: number; fullName: string }[]>([])
const activeClients = ref<{ id: number; companyName: string }[]>([])
const activePlatforms = ref<{ id: number; serial: string; brand: string; model: string }[]>([])

const columns = [
  { label: 'Código', key: 'codeQuotation' },
  { label: 'Inicio de Servicio', key: 'startDate' },
  { label: 'Fin de Servicio', key: 'endDate' },
  { label: 'Estado', key: 'status' },
  { label: 'Creación', key: 'createdAt' },
  { label: 'Acciones', key: 'actions' }
]

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredQuotations = computed(() => quotations.value)

async function safeCall<T>(fn: () => Promise<T>, onError: string): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    console.error(onError, err)
    return null
  }
}

async function fetchActiveData() {
  activeClients.value = (await safeCall(getActiveClients, 'Error al cargar clientes')) || []
  activePlatforms.value = (await safeCall(getActivePlatforms, 'Error al cargar plataformas')) || []
}

async function fetchQuotations() {
  const res = await safeCall(() => getPaginatedQuotations(currentPage.value), 'Error al obtener cotizaciones')
  if (!res) return
  quotations.value = res.quotations
  total.value = res.total
  pageSize.value = res.pageSize
}

async function handleSearchQuotation() {
  const code = searchInput.value.trim()
  if (!code) return
  const res = await safeCall(() => searchQuotationByCode(code), 'Error al buscar cotización')
  if (res && res.data) {
    quotations.value = [res.data]
    total.value = 1
    currentPage.value = 1
    isSearching.value = true
  } else {
    notifyError({ title: 'No encontrado', description: 'No se encontró ninguna cotización con ese código.' })
  }
}

async function cancelSearch() {
  searchInput.value = ''
  isSearching.value = false
  await fetchQuotations()
}

async function viewQuotation(id: number) {
  const data = await safeCall(() => getQuotationById(id), 'Error al obtener detalle de cotización')
  if (!data) return
  selectedQuotation.value = data
  isModalOpen.value = true
}

async function loadOperators() {
  const res = await safeCall(getAvailableOperators, 'Error al obtener operadores')
  if (res) availableOperators.value = res
}

async function openApproveModal(id: number) {
  const data = await safeCall(() => getQuotationById(id), 'Error al preparar aprobación')
  if (!data) return
  selectedQuotation.value = data
  approveQuotationId.value = id
  isApproveModalOpen.value = true
  if (data.isNeedOperator) await loadOperators()
}

async function submitApproval(payload: { deliveryAmount: number; operatorId: number | null }) {
  loadingState.value = 'approving'
  try {
    await approveQuotation({
      quotationId: approveQuotationId.value!,
      deliveryAmount: payload.deliveryAmount,
      operatorId: payload.operatorId
    })
    notifySuccess({ title: 'Cotización aprobada', description: 'La cotización fue aprobada correctamente.' })
    isApproveModalOpen.value = false
    await fetchQuotations()
  } catch {
    notifyError({ title: 'Error al aprobar', description: 'Ocurrió un error al aprobar la cotización.' })
  } finally {
    loadingState.value = 'none'
  }
}

function openPayModal(id: number) {
  payQuotationId.value = id
  isPayModalOpen.value = true
}

function onPaidSuccessfully() {
  fetchQuotations()
}

async function submitCancellation() {
  if (!cancelQuotationId.value) return
  loadingState.value = 'cancelling'
  try {
    await cancelQuotation(cancelQuotationId.value)
    notifySuccess({ title: 'Cotización cancelada', description: 'Se canceló correctamente.' })
    isCancelConfirmOpen.value = false
    cancelQuotationId.value = null
    await fetchQuotations()
  } catch {
    notifyError({ title: 'Error al cancelar', description: 'No se pudo cancelar la cotización.' })
  } finally {
    loadingState.value = 'none'
  }
}

function handleApproval(payload: { deliveryAmount: number; operatorId: number | null }) {
  submitApproval(payload)
}

function confirmCancellation(id: number) {
  cancelQuotationId.value = id
  isCancelConfirmOpen.value = true
}

function getStatusBadge(status: string): string {
  const label = getQuotationStatusLabel(status as any)
  const cls = getQuotationStatusBadgeClass(status as any)
  return `<span class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${cls}">${label}</span>`
}

watch([currentPage, selectedStatus], () => {
  if (!isSearching.value) fetchQuotations()
})

watch([isApproveModalOpen, isModalOpen], ([isApproveOpen, isDetailOpen]) => {
  if (!isApproveOpen && !isDetailOpen) {
    selectedQuotation.value = null
    availableOperators.value = []
  }
})

watch(isCreateModalOpen, async (open) => {
  if (open) await fetchActiveData()
  else {
    activeClients.value = []
    activePlatforms.value = []
  }
})

onMounted(fetchQuotations)
</script>
