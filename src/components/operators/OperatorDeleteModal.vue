<template>
    <BaseModal :modelValue="isOpen" @update:modelValue="$emit('close')" :hideCloseButton="isDeleting">
        <div class="space-y-4">
            <h2 class="text-lg font-semibold text-red-600 flex items-center gap-2">
                <Trash2 class="w-5 h-5" />
                Confirmar eliminación
            </h2>
            <p class="text-sm text-gray-600">
                ¿Estás seguro de que deseas eliminar al operario <strong>{{ operator?.username }}</strong>? Esta acción
                no se puede deshacer.
            </p>
            <div class="text-right pt-4 border-t">
                <button @click="$emit('close')" class="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 mr-2"
                    :disabled="isDeleting">
                    Cancelar
                </button>
                <button @click="$emit('confirm')"
                    class="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                    :disabled="isDeleting">
                    {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
                </button>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'
import { Trash2 } from 'lucide-vue-next'
import type { Operator } from '../../types/operator'

defineProps<{
    isOpen: boolean
    operator: Operator | null
    isDeleting: boolean
}>()

defineEmits(['close', 'confirm'])
</script>