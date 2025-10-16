<template>
  <div class="card">
    <h5 class="text-center">Cobertura de Rociado Residual vs Promedio de Huevecillos</h5>
    <canvas id="rociadoChart" style="max-height: 450px;"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

onMounted(() => {
  const ctx = document.getElementById('rociadoChart')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A. López Mateos', 'Payo Obispo', 'Proterritorio', 'Forjadores'],
      datasets: [
        {
          label: 'Cobertura de Rociado (%)',
          data: [95, 66, 94, 54],
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          yAxisID: 'y1'
        },
        {
          label: 'Promedio de Huevecillos',
          data: [4.2, 8.7, 3.1, 11.2],
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
          yAxisID: 'y2'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y1: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Cobertura (%)' },
          min: 0,
          max: 100
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
