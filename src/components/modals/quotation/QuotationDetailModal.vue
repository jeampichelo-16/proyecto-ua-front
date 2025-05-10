<template>
  <BaseModal :modelValue="isOpen" @update:modelValue="$emit('close')">
    <div class="space-y-6">
      <!-- Título -->
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <ClipboardList class="w-5 h-5 text-yellow-500" />
        Detalles de Cotización
      </h2>

      <!-- Cliente -->
      <section class="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div class="flex items-start gap-2">
          <User class="w-4 h-4 mt-1 text-gray-500" />
          <p><span class="font-medium">Cliente:</span> {{ quotation?.client.name }}</p>
        </div>
        <div class="flex items-start gap-2">
          <Mail class="w-4 h-4 mt-1 text-gray-500" />
          <p class="break-all whitespace-normal leading-snug">
            <span class="font-medium">Correo:</span> {{ quotation?.client.email }}
          </p>
        </div>
      </section>

      <hr class="border-gray-200" />

      <!-- Plataforma y Fechas -->
      <section class="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div class="flex items-start gap-2">
          <Wrench class="w-4 h-4 mt-1 text-gray-500" />
          <p>
            <span class="font-medium">Plataforma:</span>
            {{ quotation?.platform.serial }} ({{ quotation?.platform.brand }} - {{ quotation?.platform.model }})
          </p>
        </div>
        <div class="flex flex-col gap-1 text-sm text-gray-700">
          <div class="flex items-start gap-2">
            <Calendar class="w-4 h-4 mt-1 text-gray-500" />
            <p><span class="font-medium">Desde:</span> {{ formatDate(quotation?.startDate) }}</p>
          </div>
          <div class="flex items-start gap-2">
            <Calendar class="w-4 h-4 mt-1 text-gray-500" />
            <p><span class="font-medium">Hasta:</span> {{ formatDate(quotation?.endDate) }}</p>
          </div>
          <div v-if="quotation?.startDate && quotation?.endDate" class="flex items-start gap-2">
            <Calendar class="w-4 h-4 mt-1 text-gray-500" />
            <p>
              <span class="font-medium">Días de alquiler:</span>
              {{ calculateDays(quotation.startDate, quotation.endDate) }}
            </p>
          </div>
        </div>
      </section>

      <!-- Montos -->
      <section v-if="quotation?.status !== 'PENDIENTE_DATOS'" class="text-sm text-gray-700">
        <hr class="border-gray-200 my-2" />
        <div class="overflow-x-auto">
          <table class="w-full max-w-md border border-gray-200 rounded text-sm">
            <tbody>
              <tr class="border-b">
                <td class="px-3 py-2 text-gray-600">Monto base</td>
                <td class="px-3 py-2 text-right">{{ currency(quotation?.amount) }}</td>
              </tr>
              <tr class="border-b">
                <td class="px-3 py-2 text-gray-600">Costo de envío</td>
                <td class="px-3 py-2 text-right">{{ currency(quotation?.deliveryAmount) }}</td>
              </tr>
              <tr class="border-b">
                <td class="px-3 py-2 text-gray-600">Subtotal</td>
                <td class="px-3 py-2 text-right">{{ currency(quotation?.subtotal) }}</td>
              </tr>
              <tr class="border-b">
                <td class="px-3 py-2 text-gray-600">IGV</td>
                <td class="px-3 py-2 text-right">{{ currency(quotation?.igv) }}</td>
              </tr>
              <tr class="bg-yellow-50">
                <td class="px-3 py-2 font-semibold text-yellow-700">Total</td>
                <td class="px-3 py-2 font-bold text-right text-yellow-900">{{ currency(quotation?.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Estado y Fechas -->
      <hr class="border-gray-200" />
      <section class="grid gap-2 text-sm text-gray-700">
        <div class="flex items-center gap-2">
          <ClipboardList class="w-4 h-4 text-gray-500" />
          <p><span class="font-medium">Estado:</span> {{ quotation?.status }}</p>
        </div>
        <div class="flex items-center gap-2">
          <Calendar class="w-4 h-4 text-gray-500" />
          <p><span class="font-medium">Fecha de creación:</span> {{ formatDate(quotation?.createdAt ?? '') }}</p>
        </div>
        <div v-if="quotation?.status === 'PENDIENTE_PAGO' || quotation?.status === 'PAGADO'"
          class="flex items-center gap-2">
          <Calendar class="w-4 h-4 text-gray-500" />
          <p><span class="font-medium">Fecha de actualización de datos:</span> {{
            formatDate(quotation.statusToPendingPagoAt) }}
          </p>
        </div>
        <div v-if="quotation?.status === 'RECHAZADO'" class="flex items-center gap-2">
          <Calendar class="w-4 h-4 text-gray-500" />
          <p><span class="font-medium">Fecha de rechazo:</span> {{ formatDate(quotation.statusToRechazadoAt) }}</p>
        </div>
        <div v-if="quotation?.status === 'PAGADO'" class="flex items-center gap-2">
          <Calendar class="w-4 h-4 text-gray-500" />
          <p><span class="font-medium">Fecha de pago:</span> {{ formatDate(quotation.statusToPagadoAt) }}</p>
        </div>
      </section>

      <section class="grid gap-2 text-sm text-gray-700">
        <!-- PDF -->
        <div v-if="quotation?.quotationPath" class="flex items-center gap-2 text-sm text-gray-700">
          <FileText class="w-4 h-4 text-gray-600" />
          <span class="font-medium">Cotización:</span>
          <a :href="quotation.quotationPath" target="_blank" class="text-blue-600 hover:underline">
            Ver documento
          </a>
        </div>

        <!-- PDF -->
        <div v-if="quotation?.paymentReceiptPath" class="flex items-center gap-2 text-sm text-gray-700">
          <FileText class="w-4 h-4 text-gray-600" />
          <span class="font-medium">Recibo de pago:</span>
          <a :href="quotation.paymentReceiptPath" target="_blank" class="text-blue-600 hover:underline">
            Ver documento
          </a>
        </div>
      </section>

      <!-- Footer -->
      <div class="text-right pt-4 border-t">
        <button @click="$emit('close')" class="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200">
          Cerrar
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { FileText, Calendar, User, Mail, ClipboardList, Wrench } from 'lucide-vue-next'
import BaseModal from '../../BaseModal.vue'
import { formatDate } from '../../../utils/date'
import type { QuotationDetail } from '../../../types/quotation'

defineProps<{
  isOpen: boolean
  quotation: QuotationDetail | null
}>()

defineEmits(['close'])

const currency = (val?: number | null) => `S/ ${val?.toFixed(2) ?? '0.00'}`

const calculateDays = (start: string | Date, end: string | Date): number => {
  const d1 = new Date(start)
  const d2 = new Date(end)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
</script>
