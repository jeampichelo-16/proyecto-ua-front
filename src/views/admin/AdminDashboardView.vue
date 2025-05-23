<template>
  <div class="p-6 space-y-8">
    <header class="mb-4">
      <h1 class="text-2xl font-bold text-gray-800">Panel Administrativo</h1>

      <p class="text-gray-500 text-sm">Vista exclusiva para administradores del sistema.</p>
    </header>

    <!-- Métricas globales -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardDashboard title="Monto Total Pagado (S/)" :value="totalPaid" />
      <CardDashboard title="Tasa Promedio Cotizaciones (%)" :value="averageRate" />
      <CardDashboard title="Tiempo Promedio Respuesta (min)" :value="averageResponseTime" />
    </section>

    <!-- Gráficos de líneas -->
    <section>
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Rendimiento Histórico</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartLine title="Tasa de Cotizaciones Pagadas (%)" :data="quotationRateChart" label="rate"
          averageLabel="Promedio: {{ averageRate.toFixed(1) }}%" />
        <ChartLine title="Promedio Tiempo de Respuesta (min)" :data="responseTimeChart" label="responseMinutes"
          averageLabel="Promedio: {{ averageResponseTime.toFixed(1) }} min" />
      </div>
    </section>

    <!-- Distribuciones actuales -->
    <section>
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Distribución Actual de Estados</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartPie title="Estado de Plataformas" :data="dashboard?.platformStatusDistribution.data ?? []" />
        <ChartPie title="Estado de Operarios" :data="dashboard?.operatorStatusDistribution.data ?? []" />
        <ChartPie title="Estado de Cotizaciones" :data="dashboard?.quotationStatusDistribution.data ?? []" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { AdminDashboardData, TimeSeriesPoint } from '../../types/dashboard';
import { getAdminDashboard } from '../../services/admin.service';
import CardDashboard from '../../components/CardDashboard.vue'
import ChartLine from '../../components/ChartLine.vue'
import ChartPie from '../../components/ChartPie.vue'

const dashboard = ref<AdminDashboardData | null>(null)

const quotationRateChart = ref<Array<{ fecha: string; rate: number }>>([])
const responseTimeChart = ref<Array<{ fecha: string; responseMinutes: number }>>([])

const averageRate = computed(() => dashboard.value?.averageProcessedRate.value ?? 0)
const averageResponseTime = computed(() => dashboard.value?.averageResponseTime.value ?? 0)
const totalPaid = computed(() => dashboard.value?.totalPaidAmount.value ?? 0)

onMounted(async () => {
  try {
    const data = await getAdminDashboard()
    dashboard.value = data

    quotationRateChart.value = data.processedRateSeries.map((item: TimeSeriesPoint) => ({
      fecha: item.label,
      rate: item.value
    }))

    responseTimeChart.value = data.responseTimeSeries.map((item: TimeSeriesPoint) => ({
      fecha: item.label,
      responseMinutes: item.value
    }))
  } catch (error) {
    console.error('Error al cargar dashboard:', error)
  }
})
</script>
