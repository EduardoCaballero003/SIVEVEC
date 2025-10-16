<template>
  <div class="card shadow-sm p-3 mb-4">
    <h5 class="text-center">Indicadores de Ovitrampas - Chetumal</h5>
    <canvas ref="chart" style="max-height: 450px;"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'

const chart = ref(null)

onMounted(() => {
  const ctx = chart.value.getContext('2d')

  // 🔹 Datos simulados
  const semanas = ['Sem 30', 'Sem 31', 'Sem 32', 'Sem 33', 'Sem 34', 'Sem 35']
  const promedioHuevecillos = [48, 55, 61, 73, 65, 58]
  const porcentajeLectura = [92, 95, 88, 91, 94, 90]
  const porcentajePositivas = [36, 42, 50, 46, 40, 38]

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: semanas,
      datasets: [
        {
          type: 'bar',
          label: 'Promedio de Huevecillos',
          data: promedioHuevecillos,
          backgroundColor: 'rgba(54, 162, 235, 0.7)', // Azul
          borderRadius: 6,
          order: 1
        },
        {
          type: 'line',
          label: '% Lectura de Ovitrampas',
          data: porcentajeLectura,
          borderColor: 'rgba(255, 99, 132, 1)', // Rojo
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          tension: 0.3,
          yAxisID: 'y',
          order: 0
        },
        {
          type: 'line',
          label: '% Ovitrampas Positivas',
          data: porcentajePositivas,
          borderColor: 'rgba(75, 192, 75, 1)', // Verde
          backgroundColor: 'rgba(75, 192, 75, 0.2)',
          borderWidth: 2,
          tension: 0.3,
          yAxisID: 'y',
          order: 0
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      stacked: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Indicadores Semanales de Ovitrampas'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Semanas Epidemiológicas'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Promedios / Porcentajes'
          }
        }
      }
    }
  })
})
</script>
