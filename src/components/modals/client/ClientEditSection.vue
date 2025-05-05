<template>
    <form @submit.prevent="submitEdit" class="space-y-4 text-sm text-gray-700">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Nombre -->
            <div>
                <label class="block mb-1 font-medium">Nombre</label>
                <input v-model="form.name" :class="inputClass" :disabled="isSubmitting" />
            </div>

            <!-- Teléfono -->
            <div>
                <label class="block mb-1 font-medium">Teléfono</label>
                <input v-model="form.phone" :class="inputClass" :disabled="isSubmitting" />
            </div>

            <!-- Email -->
            <div class="sm:col-span-2">
                <label class="block mb-1 font-medium">Correo</label>
                <input type="email" v-model="form.email" :class="inputClass" :disabled="isSubmitting" />
            </div>

            <!-- Razón Social -->
            <div class="sm:col-span-2">
                <label class="block mb-1 font-medium">Razón Social</label>
                <input v-model="form.companyName" :class="inputClass" :disabled="isSubmitting" />
            </div>

            <!-- Dirección -->
            <div class="sm:col-span-2">
                <label class="block mb-1 font-medium">Dirección</label>
                <input v-model="form.address" :class="inputClass" :disabled="isSubmitting" />
            </div>

            <!-- Estado -->
            <div class="flex items-center gap-2 sm:col-span-2">
                <label class="font-medium">Estado</label>
                <input type="checkbox" v-model="form.isActive" :disabled="isSubmitting" />
                <span class="text-xs text-gray-500">{{ form.isActive ? 'Activo' : 'Inactivo' }}</span>
            </div>
        </div>

        <div class="pt-4 flex justify-end gap-2 border-t">
            <button type="button" @click="$emit('cancel')" :disabled="isSubmitting"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded">
                Cancelar
            </button>
            <button type="submit"
                class="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 disabled:opacity-50"
                :disabled="isSubmitting">
                {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { detectChanges } from '../../../utils/formUtils'
import { updateClientById } from '../../../services/user.service'
import { notifyError, notifySuccess } from '../../../utils/notify'
import type { UpdateClientDto } from '../../../types/client'

const props = defineProps<{
    modelValue: UpdateClientDto
    clientId: number
}>()

const emit = defineEmits(['updated', 'cancel', 'submitting'])

const form = ref<UpdateClientDto>({ ...props.modelValue })
const original = ref<UpdateClientDto>({ ...props.modelValue })
const isSubmitting = ref(false)

const inputClass =
    'w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed'

watch(
    () => props.modelValue,
    (val) => {
        form.value = { ...val }
        original.value = { ...val }
    },
    { immediate: true }
)

async function submitEdit() {
    if (!detectChanges(form.value, original.value)) {
        notifyError({ title: 'Sin cambios', description: 'No realizaste ninguna modificación.' })
        return
    }

    try {
        isSubmitting.value = true
        emit('submitting', true)

        await updateClientById(props.clientId, form.value)
        notifySuccess({ title: 'Cliente actualizado', description: 'Cambios guardados correctamente.' })
        emit('updated')
    } catch (err) {
        notifyError({ title: 'Error al actualizar', description: 'Ocurrió un problema. Intenta nuevamente.' })
    } finally {
        isSubmitting.value = false
        emit('submitting', false)
    }
}
</script>