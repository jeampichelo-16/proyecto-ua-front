<template>
  <form class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700" @submit.prevent="onSubmit">
    <div>
      <label class="block mb-1 font-medium">Nombre</label>
      <input v-model="form.firstName" :disabled="isSubmitting"
        class="w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500" />
    </div>

    <div>
      <label class="block mb-1 font-medium">Apellido</label>
      <input v-model="form.lastName" :disabled="isSubmitting"
        class="w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500" />
    </div>

    <div>
      <label class="block mb-1 font-medium">Usuario</label>
      <input v-model="form.username" :disabled="isSubmitting"
        class="w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500" />
    </div>

    <div>
      <label class="block mb-1 font-medium">DNI</label>
      <input v-model="form.dni" :disabled="isSubmitting"
        class="w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500" />
    </div>

    <div>
      <label class="block mb-1 font-medium">Teléfono</label>
      <input v-model="form.phone" :disabled="isSubmitting"
        class="w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500" />
    </div>

    <div class="flex items-center gap-2">
      <label class="font-medium">Estado</label>
      <input type="checkbox" v-model="form.isActive" :disabled="isSubmitting" />
      <span class="text-xs text-gray-500">{{ form.isActive ? 'Activo' : 'Inactivo' }}</span>
    </div>

    <div class="sm:col-span-2 flex justify-end gap-2 pt-4 border-t">
      <button type="button" @click="$emit('cancel')" :disabled="isSubmitting"
        class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50">
        Cancelar
      </button>
      <button type="submit" :disabled="isSubmitting"
        class="px-4 py-2 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded disabled:opacity-50">
        {{ isSubmitting ? 'Guardando...' : 'Guardar cambios' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UpdateEmployeeDto } from '../../../types/employee'
import { updateEmployeeById } from '../../../services/admin.service'
import { notifyError, notifySuccess } from '../../../utils/notify'
import { detectChanges } from '../../../utils/formUtils';

const props = defineProps<{
  modelValue: UpdateEmployeeDto
  employeeId: number
}>()

const emit = defineEmits<{
  (e: 'updated'): void
  (e: 'cancel'): void
}>()

const form = ref<UpdateEmployeeDto>({ ...props.modelValue })
const original = ref<UpdateEmployeeDto>({ ...props.modelValue })
const isSubmitting = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    form.value = { ...newVal }
    original.value = { ...newVal }
  },
  { immediate: true }
)

async function onSubmit() {
  if (!detectChanges(form.value, original.value)) {
    notifyError({ title: 'Sin cambios', description: 'No hiciste modificaciones.' })
    return
  }

  try {
    isSubmitting.value = true
    await updateEmployeeById(props.employeeId, form.value) // Envío como JSON
    notifySuccess({ title: 'Actualizado', description: 'El empleado fue actualizado correctamente.' })
    emit('updated')
  } catch (error) {
    notifyError({ title: 'Error', description: 'No se pudo guardar el empleado.' })
  } finally {
    isSubmitting.value = false
  }
}

</script>
