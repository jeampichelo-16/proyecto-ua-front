<template>
    <div class="relative">
        <form @submit.prevent="submitEdit" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mt-6">
            <!-- Nombre -->
            <div>
                <label class="block mb-1 font-medium text-gray-600">Nombre</label>
                <input v-model="form.firstName" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
                    :class="[isSubmitting ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white']" />
            </div>

            <!-- Apellido -->
            <div>
                <label class="block mb-1 font-medium text-gray-600">Apellido</label>
                <input v-model="form.lastName" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
                    :class="[isSubmitting ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white']" />
            </div>

            <!-- Teléfono -->
            <div>
                <label class="block mb-1 font-medium text-gray-600">Teléfono</label>
                <input v-model="form.phone" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
                    :class="[isSubmitting ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white']" />
            </div>

            <!-- Estado -->
            <div>
                <label class="block mb-1 font-medium text-gray-600">Estado</label>
                <select v-model="form.operatorStatus" class="w-full border rounded px-3 py-2" :disabled="isSubmitting"
                    :class="[isSubmitting ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white']">
                    <option v-for="(label, value) in statusOptions" :key="value" :value="value">{{ label }}</option>
                </select>
            </div>

            <!-- Certificado de Operatividad -->
            <div>
                <label class="block mb-1 font-medium text-gray-600">Cert. Operatividad (PDF)</label>
                <input type="file" accept="application/pdf" @change="onFileChange('operativityCertificatePath', $event)"
                    :disabled="isSubmitting" :class="[
                        'block w-full text-sm border rounded',
                        isSubmitting
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed file:cursor-not-allowed'
                            : 'bg-white text-gray-600 file:bg-yellow-50 file:text-yellow-700 file:cursor-pointer',
                        'file:rounded file:border-0 file:mr-2 file:px-3 file:py-1'
                    ]" />
                <p class="text-xs text-gray-500 mt-1">Solo PDF. Máx 2MB.</p>

                <div class="text-xs mt-1 flex items-center gap-2 flex-wrap">
                    <template v-if="form.operativityCertificatePath">
                        <span>{{ form.operativityCertificatePath.name }}</span>
                        <button type="button" class="text-blue-600 underline"
                            @click="openBlobPreview('operativity')">Ver</button>
                        <button v-if="!isSubmitting" type="button" class="text-red-500 underline"
                            @click="clearFile('operativityCertificatePath')">
                            Quitar
                        </button>
                    </template>
                    <template v-else-if="props.operator?.operativityCertificatePath">
                        <button type="button" class="text-blue-600 underline"
                            @click="openFile(props.operator.operativityCertificatePath)">Ver archivo actual</button>
                    </template>
                </div>
            </div>

            <!-- Examen Médico -->
            <div>
                <label class="block mb-1 font-medium text-gray-600">Examen Médico (EMO PDF)</label>
                <input type="file" accept="application/pdf" @change="onFileChange('emoPDFPath', $event)"
                    :disabled="isSubmitting" :class="[
                        'block w-full text-sm border rounded',
                        isSubmitting
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed file:cursor-not-allowed'
                            : 'bg-white text-gray-600 file:bg-yellow-50 file:text-yellow-700 file:cursor-pointer',
                        'file:rounded file:border-0 file:mr-2 file:px-3 file:py-1'
                    ]" />
                <p class="text-xs text-gray-500 mt-1">Solo PDF. Máx 2MB.</p>

                <div class="text-xs mt-1 flex items-center gap-2 flex-wrap">
                    <template v-if="form.emoPDFPath">
                        <span>{{ form.emoPDFPath.name }}</span>
                        <button type="button" class="text-blue-600 underline"
                            @click="openBlobPreview('emo')">Ver</button>
                        <button v-if="!isSubmitting" type="button" class="text-red-500 underline"
                            @click="clearFile('emoPDFPath')">
                            Quitar
                        </button>
                    </template>
                    <template v-else-if="props.operator?.emoPDFPath">
                        <button type="button" class="text-blue-600 underline"
                            @click="openFile(props.operator.emoPDFPath)">
                            Ver archivo actual
                        </button>
                    </template>
                </div>
            </div>

            <p class="sm:col-span-2 text-xs italic text-gray-500 border-t pt-2 mt-2">
                Solo se permiten archivos PDF. Tamaño máximo por archivo: 2MB.
            </p>

            <!-- Botones -->
            <div class="sm:col-span-2 pt-4 flex justify-end gap-2">
                <button type="button" @click="$emit('cancel')"
                    class="px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200" :disabled="isSubmitting">
                    Regresar
                </button>
                <button type="submit"
                    class="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 disabled:opacity-50"
                    :disabled="isSubmitting">
                    {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { OperatorStatus, type Operator } from '../../../types/operator'
import { getPDFBlobURL, validatePDF } from '../../../utils/pdfUtils'
import { buildUpdatedFormData, detectChanges, resetForm } from '../../../utils/formUtils'
import { updateOperatorById } from '../../../services/admin.service'
import { notifySuccess, notifyError } from '../../../utils/notify'

const props = defineProps<{ operator: Operator | null }>()
const emit = defineEmits(['updated', 'cancel'])

const isSubmitting = ref(false)

const operatorId = ref<number | null>(null)
const filePreviewUrl = ref<{ operativity: string; emo: string }>({ operativity: '', emo: '' })

const form = ref({
    firstName: '',
    lastName: '',
    phone: '',
    operatorStatus: OperatorStatus.ACTIVO,
    emoPDFPath: null as File | null,
    operativityCertificatePath: null as File | null
})
const original = ref({ ...form.value })

watch(
    () => props.operator,
    (op) => {
        if (op) {
            operatorId.value = op.idOperator
            resetForm(form, {
                firstName: op.firstName,
                lastName: op.lastName,
                phone: op.phone,
                operatorStatus: op.operatorStatus,
                emoPDFPath: null,
                operativityCertificatePath: null
            })
            filePreviewUrl.value = { operativity: '', emo: '' }
            original.value = { ...form.value }
        }
    },
    { immediate: true }
)

function onFileChange(field: 'emoPDFPath' | 'operativityCertificatePath', e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file || !validatePDF(file)) return
    form.value[field] = file
    filePreviewUrl.value[field === 'emoPDFPath' ? 'emo' : 'operativity'] = getPDFBlobURL(file)
}

function clearFile(field: 'emoPDFPath' | 'operativityCertificatePath') {
    form.value[field] = null
    if (field === 'emoPDFPath') filePreviewUrl.value.emo = ''
    if (field === 'operativityCertificatePath') filePreviewUrl.value.operativity = ''
}

function openFile(url: string) {
    window.open(url, '_blank')
}
function openBlobPreview(type: 'emo' | 'operativity') {
    const url = filePreviewUrl.value[type]
    if (url) window.open(url, '_blank')
}

const statusOptions = {
    [OperatorStatus.ACTIVO]: 'Activo',
    [OperatorStatus.EN_TRABAJO]: 'En trabajo',
    [OperatorStatus.INACTIVO]: 'Inactivo',
    [OperatorStatus.NO_DISPONIBLE]: 'No disponible'
}

async function submitEdit() {
    if (!operatorId.value) {
        notifyError({ title: 'Error interno', description: 'ID del operario no disponible.' })
        return
    }

    if (!detectChanges(form.value, original.value)) {
        notifyError({ title: 'Sin cambios', description: 'No has modificado ningún campo.' })
        return
    }

    isSubmitting.value = true

    try {
        const formData = buildUpdatedFormData(form.value, original.value)
        await updateOperatorById(operatorId.value, formData)
        notifySuccess({ title: 'Actualizado', description: 'El operario fue actualizado correctamente.' })
        emit('updated')
    } catch (err) {
        notifyError({ title: 'Error al actualizar', description: 'Revisa los datos e intenta nuevamente.' })
    } finally {
        isSubmitting.value = false
    }
}
</script>