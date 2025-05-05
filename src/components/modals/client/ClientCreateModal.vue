<template>
    <BaseModal :modelValue="isOpen" @update:modelValue="$emit('close')" :hideCloseButton="isSubmitting">
        <div class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-800">Registrar Cliente</h2>

            <form class="space-y-4 text-sm text-gray-700" @submit.prevent="handleSubmit">
                <div class="grid sm:grid-cols-2 gap-4">
                    <!-- Nombre -->
                    <div>
                        <label class="block mb-1 font-medium">Nombre</label>
                        <input v-model="form.name" :disabled="isSubmitting" :class="inputClass"
                            placeholder="Ej. Jhon Doe" />
                    </div>

                    <!-- RUC -->
                    <div>
                        <label class="block mb-1 font-medium">RUC</label>
                        <input v-model="form.ruc" :disabled="isSubmitting" :class="inputClass"
                            placeholder="Ej. 123412341234" />
                    </div>

                    <!-- Razón Social -->
                    <div class="sm:col-span-2">
                        <label class="block mb-1 font-medium">Razón Social</label>
                        <input v-model="form.companyName" :disabled="isSubmitting" :class="inputClass"
                            placeholder="Ej. Constructora S.C." />
                    </div>

                    <!-- Teléfono -->
                    <div>
                        <label class="block mb-1 font-medium">Teléfono</label>
                        <input v-model="form.phone" :disabled="isSubmitting" :class="inputClass"
                            placeholder="Ej. +51 123456789" />
                    </div>

                    <!-- Correo -->
                    <div>
                        <label class="block mb-1 font-medium">Correo</label>
                        <input type="email" v-model="form.email" :disabled="isSubmitting" :class="inputClass"
                            placeholder="correo@empresa.com" />
                    </div>

                    <!-- Dirección -->
                    <div class="sm:col-span-2">
                        <label class="block mb-1 font-medium">Dirección</label>
                        <input v-model="form.address" :disabled="isSubmitting" :class="inputClass"
                            placeholder="Ej. Street 123" />
                    </div>
                </div>

                <!-- Botones -->
                <div class="text-right pt-4">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded mr-2" :disabled="isSubmitting"
                        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        :disabled="isSubmitting" :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
                        {{ isSubmitting ? 'Registrando...' : 'Registrar' }}
                    </button>
                </div>
            </form>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseModal from '../../BaseModal.vue'
import { notifyError, notifySuccess } from '../../../utils/notify'
import { createClient } from '../../../services/user.service'
import type { CreateClientDto } from '../../../types/client'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'created'])

const isSubmitting = ref(false)

const form = ref<CreateClientDto>({
    name: '',
    ruc: '',
    companyName: '',
    email: '',
    phone: '',
    address: ''
})

function resetForm() {
    form.value = {
        name: '',
        ruc: '',
        companyName: '',
        email: '',
        phone: '',
        address: ''
    }
}

watch(() => props.isOpen, (open) => {
    if (open) resetForm()
})

const inputClass = computed(() => [
    'w-full border rounded px-3 py-2',
    isSubmitting.value
        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
        : 'bg-white'
])

async function handleSubmit() {
    const { name, ruc, companyName, email, phone, address } = form.value

    if (!name || !ruc || !companyName || !email || !phone || !address) {
        notifyError({
            title: 'Campos requeridos',
            description: 'Completa todos los campos obligatorios.'
        })
        return
    }

    try {
        isSubmitting.value = true
        await createClient(form.value)
        notifySuccess({
            title: 'Cliente registrado',
            description: 'El cliente fue registrado correctamente.'
        })
        emit('created')
        emit('close')
    } catch (err) {
        notifyError({
            title: 'Error al registrar',
            description: 'Verifica los datos e intenta nuevamente.'
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>