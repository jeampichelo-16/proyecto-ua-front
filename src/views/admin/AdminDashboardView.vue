<template>
  <div class="p-6 space-y-10">
    <!-- Encabezado principal -->
    <header>
      <h1 class="text-3xl font-bold text-gray-800">Panel Administrativo</h1>
      <p class="text-gray-500 text-sm">Vista exclusiva para administradores del sistema.</p>
    </header>

    <!-- Filtros -->
    <section class="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-wrap gap-4 items-end shadow-sm">
      <div>
        <label class="block text-sm font-medium text-gray-700">Desde</label>
        <input type="date" v-model="from" class="border rounded px-3 py-2 text-sm w-40" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Hasta</label>
        <input type="date" v-model="to" class="border rounded px-3 py-2 text-sm w-40" />
      </div>
      <div>
        <button @click="fetchDashboard"
          class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded text-sm">
          Aplicar
        </button>
      </div>
    </section>

    <!-- KPIs -->
    <section>
      <h2 class="text-lg font-semibold text-gray-700 mb-3">Indicadores Globales</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardDashboard title="Monto Total Pagado (S/)" :value="totalPaid" />
        <CardDashboard title="Tasa Promedio Cotizaciones (%)" :value="averageRate" />
        <CardDashboard title="Tiempo Promedio Respuesta (min)" :value="averageResponseTime" />
      </div>
    </section>

    <!-- Gráficos de línea -->
    <section>
      <h2 class="text-lg font-semibold text-gray-700 mb-3">Rendimiento Histórico</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartLine title="Tasa de Cotizaciones Pagadas (%)" :data="quotationRateChart" label="rate"
          :averageLabel="`Promedio: ${averageRate.toFixed(1)}%`" />
        <ChartLine title="Promedio Tiempo de Respuesta (min)" :data="responseTimeChart" label="responseMinutes"
          :averageLabel="`Promedio: ${averageResponseTime.toFixed(1)} min`" />
      </div>
    </section>

    <!-- Pie Charts -->
    <section>
      <h2 class="text-lg font-semibold text-gray-700 mb-3">Distribución Actual de Estados</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartBarHorizontal title="Estado de Plataformas" :data="(dashboard?.platformStatusDistribution.data ?? []).map(item => ({
          label: item.status,
          value: item.count
        }))" />
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
import ChartBarHorizontal from '../../components/ChartBarHorizontal.vue';

const dashboard = ref<AdminDashboardData | null>(null)
const from = ref<string | null>(null)
const to = ref<string | null>(null)

const quotationRateChart = ref<Array<{ fecha: string; rate: number }>>([])
const responseTimeChart = ref<Array<{ fecha: string; responseMinutes: number }>>([])

const averageRate = computed(() => dashboard.value?.averageProcessedRate.value ?? 0)
const averageResponseTime = computed(() => dashboard.value?.averageResponseTime.value ?? 0)
const totalPaid = computed(() => dashboard.value?.totalPaidAmount.value ?? 0)

const fetchDashboard = async () => {
  try {
    const data = await getAdminDashboard(from.value, to.value)
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
}

onMounted(() => {
  fetchDashboard()
})
</script>
