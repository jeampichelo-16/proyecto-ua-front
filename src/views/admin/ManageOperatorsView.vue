<template>
  <div class="p-6 space-y-6">
    <BaseDataTable :columns="columns" :items="filteredOperators">
      <!-- Cabecera -->
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Operarios</h1>
        </div>
        <div class="space-y-1 text-sm text-gray-600 leading-relaxed">
          <p>Administra los usuarios de tipo operario registrados en la plataforma.</p>
        </div>
      </template>

      <!-- Filtro -->
      <template #filters>
        <div class="w-full max-w-sm">
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, usuario o correo..."
            class="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm" />
        </div>
      </template>

      <!-- Filas -->
      <template #row="{ items }">
        <tr v-for="op in items" :key="op.id" class="hover:bg-yellow-50 transition duration-150">
          <td class="px-6 py-3">{{ op.firstName }} {{ op.lastName }}</td>
          <td class="px-6 py-3">{{ op.username }}</td>
          <td class="px-6 py-3">{{ op.email }}</td>
          <td class="px-6 py-3">{{ op.dni }}</td>
          <td class="px-6 py-3">{{ op.phone }}</td>
          <td class="px-6 py-3">
            <span :class="[
              'inline-block px-2 py-1 text-xs font-semibold rounded-full',
              op.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              {{ op.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
            <div class="flex gap-2">
              <!-- Ver -->
              <button @click="viewOperator(op)" class="text-blue-600 hover:underline text-xs">
                Ver
              </button>

              <!-- Editar -->
              <button @click="editOperator(op)" class="text-yellow-600 hover:underline text-xs">
                Editar
              </button>

              <!-- Eliminar -->
              <button @click="deleteOperator(op)" class="text-red-600 hover:underline text-xs">
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      </template>

      <!-- Paginación -->
      <template #pagination>
        <BasePagination :currentPage="currentPage" :totalPages="totalPages" :hasNextPage="operators.length === pageSize"
          @update:page="currentPage = $event" />
      </template>
    </BaseDataTable>

    <BaseModal v-model="isModalOpen">
      <div class="space-y-6">
        <!-- Header -->
        <div class="border-b pb-2">
          <h2 class="text-lg font-semibold text-gray-800">Detalles del Operario</h2>
          <p class="text-sm text-gray-500">Información completa del registro seleccionado.</p>
        </div>

        <!-- Detalles -->
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <template v-for="(field, index) in operatorFields" :key="index">
            <div :class="index">
              <dt class="font-medium text-gray-500">{{ field.label }}</dt>
              <dd v-if="!field.rawHtml">{{ field.value() }}</dd>
              <dd v-else v-html="field.value()" />
            </div>
          </template>

          <!-- Certificados -->
          <div class="sm:col-span-2">
            <dt class="font-medium text-gray-500 mb-1">Certificados</dt>
            <dd class="space-y-2">
              <div class="flex items-center gap-2">
                <FileText class="w-4 h-4 text-gray-600" />
                <span class="text-sm text-gray-700">Certificado de operatividad:</span>
                <a v-if="selectedOperator?.operativityCertificatePath"
                  :href="selectedOperator.operativityCertificatePath" target="_blank"
                  class="text-blue-600 hover:underline text-sm">
                  Ver PDF
                </a>
              </div>
              <div class="flex items-center gap-2">
                <FileText class="w-4 h-4 text-gray-600" />
                <span class="text-sm text-gray-700">Examen médico ocupacional (EMO):</span>
                <a v-if="selectedOperator?.emoPDFPath" :href="selectedOperator.emoPDFPath" target="_blank"
                  class="text-blue-600 hover:underline text-sm">
                  Ver PDF
                </a>
              </div>
            </dd>
          </div>
        </dl>


        <!-- Footer -->
        <div class="pt-4 border-t flex justify-end">
          <button class="px-4 py-2 text-sm rounded-md font-medium bg-gray-100 hover:bg-gray-200 transition"
            @click="isModalOpen = false">
            Cerrar
          </button>
        </div>
      </div>
    </BaseModal>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Operator } from '../../types/operator'
import { getPaginatedOperators } from '../../services/admin.service'
import { getOperatorById } from '../../services/admin.service'
import BaseDataTable from '../../components/BaseDataTable.vue'
import BasePagination from '../../components/BasePagination.vue'
import BaseModal from '../../components/BaseModal.vue'
import { FileText } from 'lucide-vue-next'

const operators = ref<Operator[]>([])
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedOperator = ref<Operator | null>(null)
const isModalOpen = ref(false)

const columns = [
  { label: 'Nombre completo', key: 'name' },
  { label: 'Usuario', key: 'username' },
  { label: 'Email', key: 'email' },
  { label: 'DNI', key: 'dni' },
  { label: 'Teléfono', key: 'phone' },
  { label: 'Estado', key: 'status' },
  { label: 'Acciones', key: 'actions' }
]

const operatorFields = [
  { label: 'Nombre completo', value: () => `${selectedOperator.value?.firstName} ${selectedOperator.value?.lastName}` },
  { label: 'Nombre de usuario', value: () => selectedOperator.value?.username },
  { label: 'Correo electrónico', value: () => selectedOperator.value?.email },
  { label: 'DNI', value: () => selectedOperator.value?.dni },
  { label: 'Teléfono', value: () => selectedOperator.value?.phone },
  { label: 'Rol', value: () => selectedOperator.value?.role.toLowerCase() },
  {
    label: 'Estado',
    value: () =>
      `<span class='px-2 py-1 rounded-full text-xs font-semibold ${selectedOperator.value?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }'>${selectedOperator.value?.isActive ? 'Activo' : 'Inactivo'}</span>`,
    rawHtml: true
  }
]


const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredOperators = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return operators.value.filter(
    op =>
      op.firstName.toLowerCase().includes(q) ||
      op.lastName.toLowerCase().includes(q) ||
      op.username.toLowerCase().includes(q) ||
      op.email.toLowerCase().includes(q)
  )
})

async function fetchOperators() {
  try {
    const res = await getPaginatedOperators(currentPage.value)
    operators.value = res.users
    total.value = res.total
    pageSize.value = res.pageSize
  } catch (error) {
    console.error('Error al cargar operarios:', error)
  }
}


async function viewOperator(op: Operator) {
  try {
    const res = await getOperatorById(op.idOperator) // 👈 ID dinámico
    selectedOperator.value = res
    isModalOpen.value = true
  } catch (err) {
    console.error('Error al cargar detalles del operario:', err)
  }
}

function editOperator(operator: Operator) {
  console.log('Editar operador:', operator)
  // ⚡ Aquí puedes redirigir o abrir modal de edición
}

function deleteOperator(operator: Operator) {
  if (confirm(`¿Seguro que deseas eliminar a ${operator.username}?`)) {
    console.log('Eliminar operador:', operator)
    // ⚠️ Aquí llamarías al endpoint DELETE
  }
}

watch(currentPage, fetchOperators)
onMounted(fetchOperators)
</script>