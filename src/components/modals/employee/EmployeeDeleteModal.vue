<template>
    <BaseModal :modelValue="isOpen" @update:modelValue="$emit('close')" :hideCloseButton="isDeleting" maxWidth="sm">
        <div class="space-y-4">
            <h2 class="text-lg font-semibold text-red-600 flex items-center gap-2">
                <Trash2 class="w-5 h-5" />
                Confirmar eliminación
            </h2>

            <p class="text-sm text-gray-600">
                ¿Estás seguro de que deseas eliminar al empleado
                <strong class="text-gray-900">{{ employee?.username }}</strong>? Esta acción no se puede deshacer.
            </p>

            <div class="pt-4 border-t flex justify-end gap-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isDeleting">
                    Cancelar
                </button>

                <button @click="$emit('confirm')"
                    class="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isDeleting">
                    {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
                </button>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../../../components/BaseModal.vue'
import { Trash2 } from 'lucide-vue-next'
import type { Employee } from '../../../types/employee'

defineProps<{
    isOpen: boolean
    employee: Employee | null
    isDeleting: boolean
}>()

defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
}>()
</script>