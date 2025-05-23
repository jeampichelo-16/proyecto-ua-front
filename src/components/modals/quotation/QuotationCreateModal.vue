<template>
    <BaseModal :modelValue="isOpen" @update:modelValue="emit('update:isOpen', $event)" :hideCloseButton="isLoading">
        <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <PlusCircle class="w-5 h-5 text-yellow-500" />
                Nueva Cotización
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <!-- Cliente -->
                <div>
                    <label class="block mb-1 text-gray-700">Cliente</label>
                    <select v-model="form.clientId" :disabled="isLoading" class="w-full border rounded px-3 py-2">
                        <option disabled value="">Seleccione</option>
                        <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.companyName }}</option>
                    </select>
                </div>

                <!-- Plataforma -->
                <div>
                    <label class="block mb-1 text-gray-700">Plataforma</label>
                    <select v-model="form.platformId" :disabled="isLoading" class="w-full border rounded px-3 py-2">
                        <option disabled value="">Seleccione</option>
                        <option v-for="p in platforms" :key="p.id" :value="p.id">
                            {{ p.serial }} ({{ p.brand }} - {{ p.model }})
                        </option>
                    </select>
                </div>

                <!-- Descripción -->
                <div class="sm:col-span-2">
                    <label class="block mb-1 text-gray-700">Descripción</label>
                    <textarea v-model="form.description" :disabled="isLoading" rows="3"
                        class="w-full border rounded px-3 py-2" />
                </div>

                <!-- Fecha de inicio -->
                <div>
                    <label class="block mb-1 text-gray-700">Fecha de inicio</label>
                    <input type="date" v-model="form.startDate" :min="minStartDate" :disabled="isLoading"
                        class="w-full border rounded px-3 py-2" />
                </div>

                <!-- Fecha de fin -->
                <div>
                    <label class="block mb-1 text-gray-700">Fecha de fin</label>
                    <input type="date" v-model="form.endDate" :min="minEndDate" :disabled="isLoading"
                        class="w-full border rounded px-3 py-2" />
                </div>

                <!-- Requiere operador -->
                <div class="flex items-center space-x-2 sm:col-span-2">
                    <input type="checkbox" id="need-operator" v-model="form.isNeedOperator" :disabled="isLoading" />
                    <label for="need-operator" class="text-sm text-gray-700">¿Requiere operador?</label>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-right pt-4 border-t">
                <button v-if="!isLoading" @click="emit('cancel')"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm mr-2">
                    Cancelar
                </button>
                <button @click="handleSubmit" :disabled="isLoading"
                    class="px-4 py-2 bg-yellow-400 text-white hover:bg-yellow-500 rounded text-sm disabled:opacity-60">
                    {{ isLoading ? 'Guardando...' : 'Guardar' }}
                </button>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PlusCircle } from 'lucide-vue-next'
import BaseModal from '../../BaseModal.vue'
import { createQuotation } from '../../../services/user.service'
import { notifyError, notifySuccess } from '../../../utils/notify'

defineProps<{
    isOpen: boolean
    clients: { id: number; companyName: string }[]
    platforms: { id: number; serial: string; brand: string; model: string }[]
}>()

const emit = defineEmits(['update:isOpen', 'created', 'cancel'])

const isLoading = ref(false)

// Fecha mínima para inicio: mañana
const getTomorrow = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date.toISOString().split('T')[0]
}
const minStartDate = computed(() => getTomorrow())

const form = ref({
    clientId: null as number | null,
    platformId: null as number | null,
    description: '',
    startDate: '',
    endDate: '',
    isNeedOperator: false
})

// Fecha mínima para fin: 2 días después de inicio
const minEndDate = computed(() => {
    if (!form.value.startDate) return minStartDate.value
    const date = new Date(form.value.startDate)
    date.setDate(date.getDate() + 2)
    return date.toISOString().split('T')[0]
})

// Si cambia la fecha de inicio, limpiar la de fin si ya no cumple
watch(() => form.value.startDate, () => {
    if (form.value.endDate && new Date(form.value.endDate) < new Date(minEndDate.value)) {
        form.value.endDate = ''
    }
})

async function handleSubmit() {
    const { clientId, platformId, description, startDate, endDate } = form.value

    if (!clientId || !platformId || !description.trim() || !startDate || !endDate) {
        notifyError({ title: 'Campos requeridos', description: 'Completa todos los campos obligatorios.' })
        return
    }

    if (new Date(endDate) < new Date(minEndDate.value)) {
        notifyError({
            title: 'Fecha inválida',
            description: 'La fecha de fin debe ser al menos 2 días después de la de inicio.'
        })
        return
    }

    isLoading.value = true

    try {
        await createQuotation({
            clientId,
            platformId,
            description,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            isNeedOperator: form.value.isNeedOperator
        })

        notifySuccess({ title: 'Cotización creada', description: 'Se ha creado correctamente.' })
        emit('update:isOpen', false)
        emit('created')
        resetForm()
    } catch {
        notifyError({ title: 'Error', description: 'No se pudo crear la cotización.' })
    } finally {
        isLoading.value = false
    }
}

function resetForm() {
    form.value = {
        clientId: null,
        platformId: null,
        description: '',
        startDate: '',
        endDate: '',
        isNeedOperator: false
    }
}
</script>
