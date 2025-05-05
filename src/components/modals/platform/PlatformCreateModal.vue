<template>
  <BaseModal :modelValue="isOpen" @update:modelValue="$emit('close')" :hideCloseButton="isSubmitting">
    <div class="space-y-6">
      <h2 class="text-lg font-semibold text-gray-800">Registrar Plataforma</h2>

      <form class="space-y-4 text-sm text-gray-700" @submit.prevent="handleSubmit">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium">Marca</label>
            <input v-model="form.brand" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
              :class="disabledInput" />
          </div>

          <div>
            <label class="block mb-1 font-medium">Modelo</label>
            <input v-model="form.model" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
              :class="disabledInput" />
          </div>

          <div>
            <label class="block mb-1 font-medium">Tipo de Plataforma</label>
            <select v-model="form.typePlatform" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
              :class="disabledInput">
              <option disabled value="">Selecciona un tipo</option>
              <option v-for="(label, value) in platformTypeOptions" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1 font-medium">Precio (S/)</label>
            <input v-model="form.price" type="number" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
              :class="disabledInput" />
          </div>

          <div>
            <label class="block mb-1 font-medium">Estado</label>
            <select v-model="form.status" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
              :class="disabledInput">
              <option disabled value="">Selecciona un estado</option>
              <option v-for="(label, value) in platformStatusOptions" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="block mb-1 font-medium">Descripción</label>
            <textarea v-model="form.description" rows="3" class="w-full border rounded px-3 py-2"
              :disabled="isSubmitting" :class="disabledInput" />
          </div>

          <!-- Certificado Operatividad -->
          <div>
            <label class="block mb-1 font-medium">Cert. Operatividad (PDF)</label>
            <input type="file" accept="application/pdf" @change="onFileChange('operativityCertificatePath', $event)"
              :disabled="isSubmitting" :class="[fileInputClass, isSubmitting ? fileDisabledClass : fileEnabledClass]" />

            <div v-if="form.operativityCertificatePath" class="text-xs mt-1">
              <span class="truncate block">{{ form.operativityCertificatePath.name }}</span>
              <div class="flex gap-2 mt-1">
                <button v-if="filePreviewUrl.operativity" type="button" @click="previewFile(filePreviewUrl.operativity)"
                  class="text-blue-600 hover:underline">Ver</button>
                <button v-if="!isSubmitting" type="button" @click="clearFile('operativityCertificatePath')"
                  class="text-red-600 hover:underline">Quitar</button>
              </div>
            </div>
          </div>

          <!-- Doc Propiedad -->
          <div>
            <label class="block mb-1 font-medium">Doc. Propiedad (PDF)</label>
            <input type="file" accept="application/pdf" @change="onFileChange('ownershipDocumentPath', $event)"
              :disabled="isSubmitting" :class="[fileInputClass, isSubmitting ? fileDisabledClass : fileEnabledClass]" />

            <div v-if="form.ownershipDocumentPath" class="text-xs mt-1">
              <span class="truncate block">{{ form.ownershipDocumentPath.name }}</span>
              <div class="flex gap-2 mt-1">
                <button v-if="filePreviewUrl.ownership" type="button" @click="previewFile(filePreviewUrl.ownership)"
                  class="text-blue-600 hover:underline">Ver</button>
                <button v-if="!isSubmitting" type="button" @click="clearFile('ownershipDocumentPath')"
                  class="text-red-600 hover:underline">Quitar</button>
              </div>
            </div>
          </div>
        </div>

        <p class="text-xs italic text-gray-500 border-t pt-2">
          Solo se permiten archivos PDF. Tamaño máximo por archivo: 2MB.
        </p>

        <!-- Footer -->
        <div class="text-right pt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded mr-2"
            :disabled="isSubmitting">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            :disabled="isSubmitting">
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
import { notifyError, notifySuccess } from '../../../utils/notify'
import { buildCreateFormData, resetForm } from '../../../utils/formUtils'
import { getPDFBlobURL, validatePDF } from '../../../utils/pdfUtils'
import { PlatformType, MachineStatus } from '../../../types/platform'
import { createPlatform } from '../../../services/admin.service'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'created'])

const isSubmitting = ref(false)

const form = ref({
  brand: '',
  model: '',
  typePlatform: '',
  price: '',
  status: '',
  description: '',
  operativityCertificatePath: null as File | null,
  ownershipDocumentPath: null as File | null
})

const filePreviewUrl = ref({ operativity: '', ownership: '' })

const platformTypeOptions = {
  [PlatformType.ELECTRICO]: 'Eléctrico',
  [PlatformType.DIESEL]: 'Diésel',
  [PlatformType.OTRO]: 'Otro'
}

const platformStatusOptions = {
  [MachineStatus.ACTIVO]: 'Activo',
  [MachineStatus.EN_TRABAJO]: 'En trabajo',
  [MachineStatus.EN_MANTENIMIENTO]: 'En mantenimiento',
  [MachineStatus.INACTIVO]: 'Inactivo'
}

function clearFile(field: 'operativityCertificatePath' | 'ownershipDocumentPath') {
  form.value[field] = null
  if (field === 'operativityCertificatePath') filePreviewUrl.value.operativity = ''
  if (field === 'ownershipDocumentPath') filePreviewUrl.value.ownership = ''
}

function previewFile(url: string) {
  window.open(url, '_blank')
}

function onFileChange(field: 'operativityCertificatePath' | 'ownershipDocumentPath', e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !validatePDF(file)) return

  form.value[field] = file
  const blob = getPDFBlobURL(file)
  filePreviewUrl.value[field === 'operativityCertificatePath' ? 'operativity' : 'ownership'] = blob
}

async function handleSubmit() {
  if (!form.value.brand || !form.value.model || !form.value.typePlatform || !form.value.price || !form.value.status) {
    notifyError({ title: 'Campos obligatorios', description: 'Completa todos los campos requeridos.' })
    return
  }

  try {
    isSubmitting.value = true
    const formData = buildCreateFormData(form.value)
    await createPlatform(formData)
    notifySuccess({ title: 'Plataforma registrada', description: 'La plataforma fue registrada correctamente.' })
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
      brand: '',
      model: '',
      typePlatform: '',
      price: '',
      status: '',
      description: '',
      operativityCertificatePath: null,
      ownershipDocumentPath: null
    })
    filePreviewUrl.value = { operativity: '', ownership: '' }
  }
})

// 🧩 Estilos dinámicos
const disabledInput = 'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed'
const fileInputClass = 'w-full text-sm border rounded file:rounded file:border-0 file:mr-2 file:px-3 file:py-1'
const fileEnabledClass = 'text-gray-600 bg-white border-gray-300 file:bg-yellow-50 file:text-yellow-700 file:cursor-pointer'
const fileDisabledClass = 'text-gray-400 bg-gray-100 border-gray-200 file:bg-gray-200 file:text-gray-500 file:cursor-not-allowed'
</script>