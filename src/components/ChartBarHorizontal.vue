<!-- components/ChartBarHorizontal.vue -->
<template>
  <div class="bg-white rounded shadow p-4">
    <h3 class="text-md font-semibold text-gray-700 mb-4">{{ title }}</h3>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Props {
  title: string
  data: Array<{ label: string, value: number }>
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.data.map(item => item.label),
  datasets: [
    {
      label: 'Cantidad',
      data: props.data.map(item => item.value),
      backgroundColor: '#facc15', // amarillo
      borderRadius: 6
    }
  ]
}))

const chartOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.parsed.x}`
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    },
    y: {
      ticks: {
        font: {
          size: 12
        }
      }
    }
  }
}
</script>
