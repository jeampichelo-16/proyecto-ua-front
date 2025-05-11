<template>
  <BaseModal :modelValue="isOpen" @update:modelValue="$emit('close')" :hideCloseButton="isSubmitting">
    <div class="space-y-6">
      <h2 class="text-lg font-semibold text-gray-800">Registrar Operario</h2>

      <form class="space-y-4 text-sm text-gray-700" @submit.prevent="handleSubmit">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium">Nombre</label>
            <input v-model="form.firstName" :disabled="isSubmitting" :class="inputClass" />
          </div>

          <div>
            <label class="block mb-1 font-medium">Apellido</label>
            <input v-model="form.lastName" :disabled="isSubmitting" :class="inputClass" />
          </div>

          <div>
            <label class="block mb-1 font-medium">DNI</label>
            <input v-model="form.dni" :disabled="isSubmitting" :class="inputClass" />
          </div>

          <div>
            <label class="block mb-1 font-medium">Teléfono</label>
            <input v-model="form.phone" :disabled="isSubmitting" :class="inputClass" />
          </div>

          <div class="sm:col-span-2">
            <label class="block mb-1 font-medium">Correo</label>
            <input type="email" v-model="form.email" :disabled="isSubmitting" :class="inputClass" />
          </div>

          <div class="sm:col-span-2">
            <label class="block mb-1 font-medium">Costo del Servicio (S/)</label>
            <input v-model.number="form.costService" type="number" step="0.01" min="0" :disabled="isSubmitting" :class="inputClass" />
          </div>

          <!-- Certificado Operatividad -->
          <div>
            <label class="block mb-1 font-medium">Cert. Operatividad (PDF)</label>
            <input
              type="file"
              ref="operativityInput"
              accept="application/pdf"
              @change="onFileChange('operativityCertificatePath', $event)"
              :disabled="isSubmitting"
              :class="fileInputClass"
            />
            <div v-if="form.operativityCertificatePath" class="text-xs mt-1">
              <span class="truncate block">{{ form.operativityCertificatePath.name }}</span>
              <div class="flex gap-2 mt-1">
                <button v-if="filePreviewUrl.operativity" type="button" @click="previewFile(filePreviewUrl.operativity)" class="text-blue-600 hover:underline">Ver</button>
                <button v-if="!isSubmitting" type="button" @click="clearFile('operativityCertificatePath')" class="text-red-600 hover:underline" :disabled="isSubmitting">Quitar</button>
              </div>
            </div>
          </div>

          <!-- Examen Médico -->
          <div>
            <label class="block mb-1 font-medium">Examen Médico (EMO PDF)</label>
            <input
              type="file"
              ref="emoInput"
              accept="application/pdf"
              @change="onFileChange('emoPDFPath', $event)"
              :disabled="isSubmitting"
              :class="fileInputClass"
            />
            <div v-if="form.emoPDFPath" class="text-xs mt-1">
              <span class="truncate block">{{ form.emoPDFPath.name }}</span>
              <div class="flex gap-2 mt-1">
                <button v-if="filePreviewUrl.emo" type="button" @click="previewFile(filePreviewUrl.emo)" class="text-blue-600 hover:underline">Ver</button>
                <button v-if="!isSubmitting" type="button" @click="clearFile('emoPDFPath')" class="text-red-600 hover:underline" :disabled="isSubmitting">Quitar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Nota -->
        <p class="text-xs italic text-gray-500 border-t pt-2">
          Solo se permiten archivos PDF. Tamaño máximo por archivo: 2MB.
        </p>

        <!-- Footer -->
        <div class="text-right pt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded mr-2" :disabled="isSubmitting">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" :disabled="isSubmitting">
            {{ isSubmitting ? 'Registrando...' : 'Registrar' }}
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '../../BaseModal.vue'
import { createOperator } from '../../../services/admin.service'
import { notifyError, notifySuccess } from '../../../utils/notify'
import { getPDFBlobURL, validatePDF } from '../../../utils/pdfUtils'
import { buildCreateFormData, resetForm } from '../../../utils/formUtils'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'created'])

const isSubmitting = ref(false)

const operativityInput = ref<HTMLInputElement | null>(null)
const emoInput = ref<HTMLInputElement | null>(null)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  dni: '',
  phone: '',
  costService: 0,
  operativityCertificatePath: null as File | null,
  emoPDFPath: null as File | null
})

const filePreviewUrl = ref({ operativity: '', emo: '' })

function clearFile(field: 'emoPDFPath' | 'operativityCertificatePath') {
  form.value[field] = null
  if (field === 'operativityCertificatePath') {
    filePreviewUrl.value.operativity = ''
    operativityInput.value && (operativityInput.value.value = '')
  }
  if (field === 'emoPDFPath') {
    filePreviewUrl.value.emo = ''
    emoInput.value && (emoInput.value.value = '')
  }
}

function previewFile(url: string) {
  window.open(url, '_blank')
}

function onFileChange(field: 'emoPDFPath' | 'operativityCertificatePath', e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !validatePDF(file)) return

  form.value[field] = file
  const blob = getPDFBlobURL(file)
  filePreviewUrl.value[field === 'emoPDFPath' ? 'emo' : 'operativity'] = blob
}

async function handleSubmit() {
  if (!form.value.firstName || !form.value.lastName || !form.value.email || !form.value.dni || form.value.costService <= 0) {
    notifyError({ title: 'Campos incompletos', description: 'Completa todos los campos obligatorios correctamente.' })
    return
  }

  try {
    isSubmitting.value = true
    const formData = buildCreateFormData(form.value)
    await createOperator(formData)
    notifySuccess({ title: 'Operario registrado', description: 'El operario fue registrado correctamente.' })
    emit('close')
    emit('created')
  } catch (err) {
    notifyError({ title: 'Error al registrar', description: 'Verifica los datos ingresados.' })
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    resetForm(form, {
      firstName: '',
      lastName: '',
      email: '',
      dni: '',
      phone: '',
      costService: 0,
      operativityCertificatePath: null,
      emoPDFPath: null
    })

    filePreviewUrl.value = {
      operativity: '',
      emo: ''
    }

    operativityInput.value && (operativityInput.value.value = '')
    emoInput.value && (emoInput.value.value = '')
  }
})

// UI Classes
const inputClass =
  'w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed'
const fileInputClass =
  'block w-full text-sm border rounded text-gray-600 bg-white border-gray-300 file:mr-2 file:rounded file:border-0 file:bg-yellow-50 file:text-yellow-700 file:px-3 file:py-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:file:bg-gray-200 disabled:file:text-gray-400 disabled:file:cursor-not-allowed'
</script>
