<template>
    <div class="bg-white p-4 rounded shadow-sm border relative">
      <h3 class="text-sm text-gray-700 font-semibold mb-2">{{ title }}</h3>
      <Line :data="chartData" :options="chartOptions" />
      <div
        class="absolute top-3 right-4 bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold shadow-sm"
      >
        Promedio mensual: {{ averageValue }}{{ suffix }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { Line } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
  
  const props = defineProps<{
    title: string
    data: any[]
    label: string
  }>()
  
  // Gráfico
  const chartData = computed(() => ({
    labels: props.data.map((d) => d.fecha),
    datasets: [
      {
        label: props.title,
        data: props.data.map((d) => d[props.label]),
        fill: false,
        borderColor: '#facc15',
        backgroundColor: '#facc15',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 5
      }
    ]
  }))
  
  // Promedio
  const averageValue = computed(() => {
    const values = props.data.map((d) => d[props.label])
    if (!values.length) return '-'
    const total = values.reduce((acc, val) => acc + val, 0)
    return (total / values.length).toFixed(1)
  })
  
  // Sufijo dinámico
  const suffix = computed(() => {
    return props.title.includes('Tasa') ? '%' : props.title.includes('Respuesta') ? ' minutos' : ''
  })
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }
  </script>
  