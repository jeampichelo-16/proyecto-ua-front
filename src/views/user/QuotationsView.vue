<template>
  <div class="p-6 space-y-6">
    <BaseDataTable :columns="columns" :items="filteredQuotations">
      <!-- Header -->
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Cotizaciones</h1>
          <button
            @click="isCreateModalOpen = true"
            class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
          >
            <PlusCircle class="w-4 h-4" />
            Generar Cotización
          </button>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed">
          Administra las cotizaciones generadas por los clientes.
        </p>
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
              q.status === 'APROBADO' ? 'bg-green-100 text-green-700'
                : q.status === 'RECHAZADO' ? 'bg-red-100 text-red-700'
                : q.status === 'PAGADO' ? 'bg-emerald-100 text-emerald-700'
                : q.status === 'PENDIENTE_DATOS' ? 'bg-gray-100 text-gray-700'
                : 'bg-yellow-100 text-yellow-700'
            ]">
              {{ q.status }}
            </span>
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

              <button v-if="q.status !== 'PAGADO' && q.status !== 'RECHAZADO'"
                @click="confirmCancellation(q.id)"
                class="flex items-center gap-1 text-red-600 hover:underline">
                <XCircle class="w-4 h-4" /> Cancelar
              </button>
            </div>
          </td>
        </tr>
      </template>

      <!-- Paginación -->
      <template #pagination>
        <BasePagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :hasNextPage="quotations.length === pageSize"
          @update:page="currentPage = $event"
        />
      </template>
    </BaseDataTable>

    <!-- Modales -->
    <QuotationCreateModal
      v-model:isOpen="isCreateModalOpen"
      :clients="activeClients"
      :platforms="activePlatforms"
      @created="fetchQuotations"
      @cancel="isCreateModalOpen = false"
    />

    <QuotationDetailModal :isOpen="isModalOpen" :quotation="selectedQuotation" @close="isModalOpen = false" />

    <QuotationApproveModal
      :isOpen="isApproveModalOpen"
      :quotation="selectedQuotation"
      :availableOperators="availableOperators"
      :isApproving="isApproving"
      @cancel="isApproveModalOpen = false"
      @submit="handleApproval"
    />

    <QuotationCancelModal
      :isOpen="isCancelConfirmOpen"
      :isCancelling="isCancelling"
      @cancel="isCancelConfirmOpen = false"
      @submit="submitCancellation"
    />

    <QuotationPayModal
      :isOpen="isPayModalOpen"
      :quotationId="payQuotationId"
      @close="isPayModalOpen = false"
      @paid="onPaidSuccessfully"
    />
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
  cancelQuotation
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

const quotations = ref<Quotation[]>([])
const selectedQuotation = ref<QuotationDetail | null>(null)

const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedStatus = ref('')

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
  { label: 'Cliente', key: 'clientName' },
  { label: 'Plataforma', key: 'platformSerial' },
  { label: 'Días', key: 'days' },
  { label: 'Total', key: 'total' },
  { label: 'Estado', key: 'status' },
  { label: 'Fecha de creación', key: 'createdAt' },
  { label: 'Acciones', key: 'actions' }
]

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredQuotations = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return quotations.value.filter(
    item =>
      item.clientName.toLowerCase().includes(q) ||
      item.platformSerial.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
  )
})

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

watch([currentPage, selectedStatus], fetchQuotations)

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
