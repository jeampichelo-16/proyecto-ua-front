<template>
  <div class="space-y-4">
    <!-- Cabecera externa -->
    <slot name="header" />

    <!-- Barra de búsqueda u otros filtros -->
    <slot name="filters" />

    <!-- Tabla principal -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full text-sm divide-y divide-gray-200">
        <thead class="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
          <tr>
            <th v-for="column in columns" :key="column.key" class="px-6 py-3 text-left whitespace-nowrap">
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 bg-white">
          <!-- Datos -->
          <template v-if="items.length">
            <slot name="row" :items="items" />
          </template>

          <!-- Sin resultados -->
          <template v-else>
            <tr>
              <td :colspan="columns.length" class="px-6 py-6 text-center text-sm text-gray-500 italic">
                <div class="flex flex-col items-center justify-center space-y-1">
                  <span class="text-base font-medium">No se encontraron resultados</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Paginación o elementos adicionales -->
    <slot name="pagination" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  columns: { label: string; key: string }[]
  items: any[]
}>()
</script>
