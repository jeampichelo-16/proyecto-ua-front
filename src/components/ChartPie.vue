<template>
    <div class="bg-white p-4 rounded shadow-sm border">
        <h3 class="text-sm text-gray-700 font-semibold mb-4">{{ title }}</h3>
        <Pie :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    type ChartOptions
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
    title: string
    data: { status: string; count: number }[]
}>()

const chartData = computed(() => ({
    labels: props.data.map((d) => d.status),
    datasets: [
        {
            label: 'Cantidad',
            data: props.data.map((d) => d.count),
            backgroundColor: [
                '#facc15', '#60a5fa', '#34d399', '#f87171', '#a78bfa',
                '#fbbf24', '#38bdf8', '#f472b6'
            ]
        }
    ]
}))

const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
}
</script>
