<template>
  <div class="card">
    <h3 class="text-center">Nebulización vs Promedio de Huevecillos por Manzana</h3>
    <canvas id="nebulizacionChart" style="max-height: 450px;"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

onMounted(() => {
  const ctx = document.getElementById('nebulizacionChart')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Centro', 'Payo Obispo', 'Forjadores', 'Proterritorio'],
      datasets: [
        {
          label: 'Manzanas Nebulizadas (UBV)',
          data: [50, 70, 30, 80],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          yAxisID: 'y1'
        },
        {
          label: 'Manzanas Nebulizadas (Termonebulización)',
          data: [20, 15, 25, 40],
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
          yAxisID: 'y1'
        },
        {
          label: 'Promedio de Huevecillos',
          data: [8.5, 4.2, 10.3, 2.7],
          type: 'line',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
          yAxisID: 'y2'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y1: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Manzanas Nebulizadas' }
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Promedio de Huevecillos' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  })
})
</script>
