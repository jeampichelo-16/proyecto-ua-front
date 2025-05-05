<template>
    <BaseModal :modelValue="isOpen" @update:modelValue="$emit('close')" :hideCloseButton="isSubmitting">
        <div class="space-y-6">
            <h2 class="text-lg font-semibold text-gray-800">Registrar Empleado</h2>

            <form class="space-y-4 text-sm text-gray-700" @submit.prevent="handleSubmit">
                <div class="grid sm:grid-cols-2 gap-4">
                    <!-- Nombre -->
                    <div>
                        <label class="block mb-1 font-medium">Nombre</label>
                        <input v-model="form.firstName" :disabled="isSubmitting" :class="[
                            'w-full border rounded px-3 py-2',
                            isSubmitting ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                        ]" />
                    </div>

                    <!-- Apellido -->
                    <div>
                        <label class="block mb-1 font-medium">Apellido</label>
                        <input v-model="form.lastName" :disabled="isSubmitting" :class="[
                            'w-full border rounded px-3 py-2',
                            isSubmitting ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                        ]" />
                    </div>

                    <!-- DNI -->
                    <div>
                        <label class="block mb-1 font-medium">DNI</label>
                        <input v-model="form.dni" :disabled="isSubmitting" :class="[
                            'w-full border rounded px-3 py-2',
                            isSubmitting ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                        ]" />
                    </div>

                    <!-- Teléfono -->
                    <div>
                        <label class="block mb-1 font-medium">Teléfono</label>
                        <input v-model="form.phone" :disabled="isSubmitting" :class="[
                            'w-full border rounded px-3 py-2',
                            isSubmitting ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                        ]" />
                    </div>

                    <!-- Correo -->
                    <div class="sm:col-span-2">
                        <label class="block mb-1 font-medium">Correo</label>
                        <input v-model="form.email" type="email" :disabled="isSubmitting" :class="[
                            'w-full border rounded px-3 py-2',
                            isSubmitting ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                        ]" />
                    </div>
                </div>

                <!-- Botones -->
                <div class="text-right pt-4">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded mr-2" :disabled="isSubmitting">
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
import { createEmployee } from '../../../services/admin.service'
import { generateUsername } from '../../../utils/generateUsername'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'created'])

const isSubmitting = ref(false)

const form = ref({
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    email: ''
})

function resetForm() {
    form.value = {
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        email: ''
    }
}

watch(() => props.isOpen, (open) => {
    if (open) resetForm()
})

async function handleSubmit() {
    const { firstName, lastName, email, dni, phone } = form.value

    if (!firstName || !lastName || !email || !dni || !phone) {
        notifyError({ title: 'Campos requeridos', description: 'Completa todos los campos obligatorios.' })
        return
    }

    const username = generateUsername(firstName, lastName)

    const payload = {
        ...form.value,
        username
    }

    try {
        isSubmitting.value = true
        await createEmployee(payload)
        notifySuccess({ title: 'Empleado registrado', description: 'El empleado fue registrado correctamente.' })
        emit('created')
        emit('close')
    } catch (err) {
        notifyError({ title: 'Error al registrar', description: 'Verifica los datos e intenta nuevamente.' })
    } finally {
        isSubmitting.value = false
    }
}
</script>