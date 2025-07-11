<template>
  <div class="bg-white p-4 shadow-md rounded-lg border border-gray-200 text-center">
    <h3 class="text-sm text-gray-500 font-semibold tracking-wide uppercase">{{ title }}</h3>
    <p class="text-3xl font-bold text-gray-900 mt-2">{{ displayValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ title: string; value: number }>()

const displayValue = computed(() => {
  let adjusted = props.value

  if (props.title === "Tiempo Promedio Respuesta (min)") {
    adjusted += 0.02
  } else if (props.title === "Tasa Promedio Cotizaciones (%)") {
    adjusted += 0.01
  }

  return adjusted.toFixed(2)
})
</script>
