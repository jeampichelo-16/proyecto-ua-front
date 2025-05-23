<template>
    <form @submit.prevent="submitEdit" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <!-- Marca -->
        <div>
            <label class="block font-medium mb-1">Marca</label>
            <input v-model="form.brand" :disabled="isSubmitting" :class="inputClass" />
        </div>

        <!-- Modelo -->
        <div>
            <label class="block font-medium mb-1">Modelo</label>
            <input v-model="form.model" :disabled="isSubmitting" :class="inputClass" />
        </div>

        <!-- Tipo Plataforma -->
        <div>
            <label class="block font-medium mb-1">Tipo Plataforma</label>
            <select v-model="form.typePlatform" :disabled="isSubmitting" :class="inputClass">
                <option v-for="(label, value) in platformTypeOptions" :key="value" :value="value">{{ label }}</option>
            </select>
        </div>

        <!-- Precio -->
        <div>
            <label class="block font-medium mb-1">Precio (S/)</label>
            <input v-model="form.price" type="number" :disabled="isSubmitting" :class="inputClass" />
        </div>

        <!-- Estado -->
        <div>
            <label class="block font-medium mb-1">Estado</label>
            <select v-model="form.status" :disabled="isSubmitting" :class="inputClass">
                <option v-for="(label, value) in statusOptions" :key="value" :value="value">{{ label }}</option>
            </select>
        </div>

        <!-- Descripción -->
        <div class="sm:col-span-2">
            <label class="block font-medium mb-1">Descripción</label>
            <textarea v-model="form.description" rows="3" :disabled="isSubmitting" :class="inputClass" />
        </div>

        <!-- Cert. Operatividad -->
        <div>
            <label class="block font-medium mb-1">Cert. Operatividad (PDF)</label>
            <input ref="operativityRef" type="file" accept="application/pdf"
                @change="onFileChange('operativityCertificatePath', $event)" :disabled="isSubmitting"
                :class="fileInputClass" />
            <p class="text-xs text-gray-500 mt-1">Solo PDF. Máx 2MB.</p>
            <div class="text-xs mt-1 flex items-center gap-2 flex-wrap">
                <template v-if="form.operativityCertificatePath">
                    <span class="truncate">{{ form.operativityCertificatePath.name }}</span>
                    <button type="button" class="text-blue-600 underline"
                        @click="openBlobPreview('operativity')">Ver</button>
                    <button v-if="!isSubmitting" type="button" class="text-red-500 underline"
                        @click="clearFile('operativityCertificatePath')">Quitar</button>
                </template>
                <template v-else-if="props.machine?.operativityCertificatePath">
                    <button type="button" class="text-blue-600 underline"
                        @click="openFile(props.machine.operativityCertificatePath)">Ver
                        archivo actual</button>
                </template>
            </div>
        </div>

        <!-- Doc. Propiedad -->
        <div>
            <label class="block font-medium mb-1">Doc. Propiedad (PDF)</label>
            <input ref="ownershipRef" type="file" accept="application/pdf"
                @change="onFileChange('ownershipDocumentPath', $event)" :disabled="isSubmitting"
                :class="fileInputClass" />
            <p class="text-xs text-gray-500 mt-1">Solo PDF. Máx 2MB.</p>
            <div class="text-xs mt-1 flex items-center gap-2 flex-wrap">
                <template v-if="form.ownershipDocumentPath">
                    <span class="truncate">{{ form.ownershipDocumentPath.name }}</span>
                    <button type="button" class="text-blue-600 underline"
                        @click="openBlobPreview('ownership')">Ver</button>
                    <button v-if="!isSubmitting" type="button" class="text-red-500 underline"
                        @click="clearFile('ownershipDocumentPath')">Quitar</button>
                </template>
                <template v-else-if="props.machine?.ownershipDocumentPath">
                    <button type="button" class="text-blue-600 underline"
                        @click="openFile(props.machine.ownershipDocumentPath)">Ver
                        archivo actual</button>
                </template>
            </div>
        </div>

        <!-- Notas -->
        <p class="sm:col-span-2 text-xs italic text-gray-500 border-t pt-2 mt-2">
            Solo se permiten archivos PDF. Tamaño máximo por archivo: 2MB.
        </p>

        <!-- Botones -->
        <div class="sm:col-span-2 flex justify-end gap-2 pt-4">
            <button type="button" class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                @click="$emit('cancel')" :disabled="isSubmitting">
                Regresar
            </button>
            <button type="submit"
                class="px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                :disabled="isSubmitting">
                {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MachineStatus, PlatformType, type Machine } from '../../../types/platform'
import { buildUpdatedFormData, detectChanges, resetForm } from '../../../utils/formUtils'
import { getPDFBlobURL, validatePDF } from '../../../utils/pdfUtils'
import { notifyError, notifySuccess } from '../../../utils/notify'
import { updatePlatformBySerial } from '../../../services/admin.service'

const props = defineProps<{ machine: Machine | null }>()
const emit = defineEmits(['cancel', 'updated', 'submitting'])

const machineSerial = ref<string | null>(null)
const isSubmitting = ref(false)

const operativityRef = ref<HTMLInputElement | null>(null)
const ownershipRef = ref<HTMLInputElement | null>(null)

const form = ref({
    brand: '',
    model: '',
    typePlatform: '',
    price: 0,
    status: 'ACTIVO' as MachineStatus,
    description: '',
    operativityCertificatePath: null as File | null,
    ownershipDocumentPath: null as File | null
})

const original = ref({ ...form.value })
const filePreviewUrl = ref({ operativity: '', ownership: '' })

const platformTypeOptions = {
    [PlatformType.ELECTRICO]: 'Eléctrico',
    [PlatformType.DIESEL]: 'Diésel',
    [PlatformType.OTRO]: 'Otro'
}

const statusOptions = {
    [MachineStatus.ACTIVO]: 'Activo',
    [MachineStatus.EN_TRABAJO]: 'En Trabajo',
    [MachineStatus.EN_MANTENIMIENTO]: 'En Mantenimiento',
    [MachineStatus.INACTIVO]: 'Inactivo'
}

watch(
    () => props.machine,
    (m) => {
        if (m) {
            machineSerial.value = m.serial
            resetForm(form, {
                brand: m.brand,
                model: m.model,
                typePlatform: m.typePlatform,
                price: m.price,
                status: m.status,
                description: m.description,
                operativityCertificatePath: null,
                ownershipDocumentPath: null
            })
            filePreviewUrl.value = { operativity: '', ownership: '' }
            original.value = { ...form.value }

            // Reset manual de inputs file

            if (operativityRef.value) operativityRef.value.value = ''
            if (ownershipRef.value) ownershipRef.value.value = ''
        }
    }, { immediate: true })

function onFileChange(field: 'operativityCertificatePath' | 'ownershipDocumentPath', e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file || !validatePDF(file)) return

    form.value[field] = file
    filePreviewUrl.value[field === 'operativityCertificatePath' ? 'operativity' : 'ownership'] = getPDFBlobURL(file)
}

function clearFile(field: 'operativityCertificatePath' | 'ownershipDocumentPath') {
    form.value[field] = null
    if (field === 'operativityCertificatePath') {
        filePreviewUrl.value.operativity = ''
        if (operativityRef.value) operativityRef.value.value = ''
    }
    if (field === 'ownershipDocumentPath') {
        filePreviewUrl.value.ownership = ''
        if (ownershipRef.value) ownershipRef.value.value = ''
    }
}

function openFile(url: string) {
    window.open(url, '_blank')
}

function openBlobPreview(type: 'operativity' | 'ownership') {
    const url = filePreviewUrl.value[type]
    if (url) window.open(url, '_blank')
}

async function submitEdit() {
    if (!props.machine?.serial) {
        notifyError({ title: 'Error', description: 'No se encontró el serial de la máquina.' })
        return
    }
    if (!detectChanges(form.value, original.value)) {
        notifyError({ title: 'Sin cambios', description: 'No realizaste ninguna modificación.' })
        return
    }
    isSubmitting.value = true
    emit('submitting', true)
    try {
        const formData = buildUpdatedFormData(form.value, original.value)
        await updatePlatformBySerial(props.machine.serial, formData)
        notifySuccess({ title: 'Actualizado', description: 'La plataforma fue actualizada correctamente.' })
        emit('updated')
    } catch {
        notifyError({ title: 'Error', description: 'Error al actualizar la plataforma.' })
    } finally {
        isSubmitting.value = false
        emit('submitting', false)
    }
}

const inputClass =
    'w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed'

const fileInputClass = [
    'block w-full text-sm border rounded',
    'file:rounded file:border-0 file:mr-2 file:px-3 file:py-1',
    'disabled:cursor-not-allowed',
    'file:bg-yellow-50 file:text-yellow-700 file:cursor-pointer',
    'bg-white text-gray-600',
    'disabled:bg-gray-100 disabled:text-gray-400 disabled:file:bg-gray-200 disabled:file:text-gray-400 disabled:file:cursor-not-allowed'
].join(' ')
</script>