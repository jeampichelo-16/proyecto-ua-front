<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Panel Administrativo</h1>
    <p class="text-gray-600">Vista exclusiva para administradores.</p>

    <!-- Tarjetas principales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <CardDashboard title="Clientes" :value="dashboard?.totalClients ?? 0" />
      <CardDashboard title="Cotizaciones" :value="dashboard?.totalQuotations ?? 0" />
      <CardDashboard title="Operadores Activos" :value="dashboard?.activeOperators ?? 0" />
    </div>

    <!-- Métricas adicionales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <CardDashboard title="Tasa Promedio Cotizaciones (%)" :value="dashboard?.quotationRateAvg ?? 0" />
      <CardDashboard title="Tasa de Conversión (%)" :value="dashboard?.quotationConversionRate ?? 0" />
      <CardDashboard title="Tiempo Promedio Respuesta (hrs)" :value="averageResponseTime" />
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartLine title="Tasa de Cotizaciones Procesadas (%)" :data="quotationRateChart" label="rate"
        averageLabel="Promedio: {{ averageRate }}%" />
      <ChartLine title="Promedio Tiempo de Respuesta (hrs)" :data="responseTimeChart" label="responseHours"
        averageLabel="Promedio: {{ averageResponseTime }} horas" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type {
  AdminDashboardData,
  QuotationRatePoint,
  ResponseTimePoint
} from '../../types/dashboard'
import { getAdminDashboard } from '../../services/admin.service'

import CardDashboard from '../../components/CardDashboard.vue'
import ChartLine from '../../components/ChartLine.vue'

const dashboard = ref<AdminDashboardData | null>(null)

const quotationRateChart = ref<Array<{ fecha: string; rate: number }>>([])
const responseTimeChart = ref<Array<{ fecha: string; responseHours: number }>>([])

const averageResponseTime = computed(() =>
  parseFloat((dashboard.value?.avgResponseTimeInHours ?? 0).toFixed(2))
)

onMounted(async () => {
  try {
    const data = await getAdminDashboard()
    dashboard.value = data

    // 🔁 Asegúrate que el campo sea `fecha`, no `date`
    quotationRateChart.value = data.quotationRateSeries.map((item: QuotationRatePoint) => ({
      fecha: item.date,
      rate: item.rate
    }))

    responseTimeChart.value = data.responseTimeSeries.map((item: ResponseTimePoint) => ({
      fecha: item.date,
      responseHours: item.responseHours
    }))
  } catch (error) {
    console.error('Error al cargar dashboard:', error)
  }
})
</script>

