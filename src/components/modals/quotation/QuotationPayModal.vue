<template>
  <BaseModal :modelValue="isOpen" @update:modelValue="emit('close')" :hideCloseButton="isSubmitting">
    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <DollarSign class="w-5 h-5 text-emerald-500" />
        Marcar como Pagada
      </h2>

      <p class="text-sm text-gray-600">Adjunta el comprobante de pago correspondiente para esta cotización.</p>

      <!-- Input de archivo -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Comprobante de pago (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          ref="fileInput"
          @change="handleFileChange"
          :disabled="isSubmitting"
          :class="inputClass"
        />

        <!-- Vista previa y control -->
        <div v-if="file" class="text-xs mt-2 flex items-center justify-between gap-2 flex-wrap">
          <span class="truncate">{{ file.name }}</span>
          <div class="flex gap-2">
            <button type="button" @click="previewPDF" class="text-blue-600 hover:underline" :disabled="isSubmitting">
              Ver
            </button>
            <button type="button" @click="clearFile" class="text-red-600 hover:underline" :disabled="isSubmitting">
              Quitar
            </button>
          </div>
        </div>
      </div>

      <p class="text-xs text-gray-500 border-t pt-2 italic">Solo archivos PDF. Máx. 2MB</p>

      <!-- Footer -->
      <div class="pt-4 flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
          @click="emit('close')"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>

        <button
          type="button"
          class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded disabled:opacity-50"
          @click="submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Enviando...' : 'Confirmar Pago' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { DollarSign } from 'lucide-vue-next'
import BaseModal from '../../BaseModal.vue'
import { notifyError, notifySuccess } from '../../../utils/notify'
import { markQuotationAsPaid } from '../../../services/user.service'

const props = defineProps<{
  isOpen: boolean
  quotationId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'paid'): void
}>()

const isSubmitting = ref(false)
const file = ref<File | null>(null)
const fileBlobUrl = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)

function handleFileChange(e: Event) {
  const selected = (e.target as HTMLInputElement).files?.[0]
  if (!selected) return

  if (selected.type !== 'application/pdf') {
    notifyError({ title: 'Formato inválido', description: 'Solo se permiten archivos PDF.' })
    resetInput()
    return
  }

  if (selected.size > 2 * 1024 * 1024) {
    notifyError({ title: 'Tamaño excedido', description: 'El archivo debe pesar menos de 2MB.' })
    resetInput()
    return
  }

  file.value = selected
  fileBlobUrl.value = URL.createObjectURL(selected)
}

function previewPDF() {
  if (fileBlobUrl.value) {
    window.open(fileBlobUrl.value, '_blank')
  }
}

function clearFile() {
  file.value = null
  fileBlobUrl.value = ''
  resetInput()
}

function resetInput() {
  // reset input value so same file can be selected again
  nextTick(() => {
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  })
}

async function submit() {
  if (!file.value) {
    notifyError({ title: 'Archivo requerido', description: 'Adjunta un comprobante antes de continuar.' })
    return
  }

  const formData = new FormData()
  formData.append('paymentReceiptPath', file.value)

  isSubmitting.value = true

  try {
    await markQuotationAsPaid(props.quotationId, formData)

    notifySuccess({
      title: 'Pago registrado',
      description: 'La cotización fue marcada como pagada correctamente.'
    })

    emit('paid')
    emit('close')
  } catch (err) {
    notifyError({
      title: 'Error al enviar',
      description: 'No se pudo registrar el pago. Intenta nuevamente.'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Estilos
const inputClass =
  'block w-full text-sm border rounded text-gray-600 bg-white border-gray-300 file:mr-2 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700 file:px-3 file:py-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:file:bg-gray-200 disabled:file:text-gray-400 disabled:file:cursor-not-allowed'
</script>
