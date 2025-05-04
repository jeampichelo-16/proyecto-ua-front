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
                    <select v-model="form.clientId" :disabled="isLoading" class="w-full border rounded px-3 py-2"
                        name="client">
                        <option disabled value="">Seleccione</option>
                        <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.companyName }}</option>
                    </select>
                </div>

                <!-- Plataforma -->
                <div>
                    <label class="block mb-1 text-gray-700">Plataforma</label>
                    <select v-model="form.platformId" :disabled="isLoading" class="w-full border rounded px-3 py-2"
                        name="platform">
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
                        class="w-full border rounded px-3 py-2" name="description" autocomplete="off" />
                </div>

                <!-- Días -->
                <div>
                    <label class="block mb-1 text-gray-700">Días</label>
                    <input type="number" min="1" v-model="form.days" :disabled="isLoading"
                        class="w-full border rounded px-3 py-2" name="days" autocomplete="off" />
                </div>

                <!-- Requiere operador -->
                <div class="flex items-center space-x-2">
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
import { ref } from 'vue'
import { PlusCircle } from 'lucide-vue-next'
import BaseModal from '../BaseModal.vue'
import { createQuotation } from '../../services/user.service'
import { notifyError, notifySuccess } from '../../utils/notify'

defineProps<{
    isOpen: boolean
    clients: { id: number; companyName: string }[]
    platforms: { id: number; serial: string; brand: string; model: string }[]
}>()

const emit = defineEmits(['update:isOpen', 'created', 'cancel'])

const isLoading = ref(false)

const form = ref({
    clientId: null as number | null,
    platformId: null as number | null,
    description: '',
    days: 1,
    isNeedOperator: false
})

async function handleSubmit() {
    const { clientId, platformId, description, days } = form.value

    if (!clientId || !platformId || !description.trim() || days <= 0) {
        notifyError({ title: 'Campos incompletos', description: 'Completa todos los campos correctamente.' })
        return
    }

    isLoading.value = true

    try {
        await createQuotation({ ...form.value, clientId: clientId!, platformId: platformId! })
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
        days: 1,
        isNeedOperator: false
    }
}
</script>