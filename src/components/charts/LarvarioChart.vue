<template>
  <div class="card p-3">
    <h3 class="text-center">Control Larvario — Casas trabajadas / Depósitos tratados / Cobertura</h3>
    <div class="d-flex gap-2">
      <input v-model="desde" type="date" class="form-control w-auto">
      <input v-model="hasta" type="date" class="form-control w-auto">
      <select v-model="filtroColonia" class="form-select w-auto">
        <option value="">Todas las colonias</option>
        <option v-for="c in colonias" :key="c" :value="c">{{ c }}</option>
      </select>
      <button class="btn btn-primary bg-green border-0 fw-bold" @click="fetchData">Actualizar</button>
    </div>

    <canvas ref="larvaChart" style="max-height: 450px;"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const desde = ref(new Date().toISOString().slice(0,10))
const hasta = ref(new Date().toISOString().slice(0,10))
const filtroColonia = ref('')
const colonias = ref(['Centro','Payo Obispo','Forjadores','Proterritorio']) // carga real desde API
const rawData = ref([])

const larvaChart = ref(null)
let chartInstance = null

async function fetchData(){
  // TODO: reemplaza con tu llamada real (axios/fetch)
  // Ejemplo estático (simula respuesta del backend)
  rawData.value = [
    {colonia:'Centro', manzanas:12, casas_trabajadas:450, depositos_tratados:110, prom_cobertura_por_manzana:37.5},
    {colonia:'Payo Obispo', manzanas:15, casas_trabajadas:380, depositos_tratados:95, prom_cobertura_por_manzana:25.3},
    {colonia:'Forjadores', manzanas:10, casas_trabajadas:220, depositos_tratados:60, prom_cobertura_por_manzana:22.0},
    {colonia:'Proterritorio', manzanas:14, casas_trabajadas:470, depositos_tratados:150, prom_cobertura_por_manzana:33.6}
  ]

  let dataset = prepareChartData()
  renderChart(dataset)
}

function prepareChartData(){
  let filtered = rawData.value.filter(r => !filtroColonia.value || r.colonia === filtroColonia.value)
  const labels = filtered.map(r => r.colonia)
  const casas = filtered.map(r => r.casas_trabajadas)
  const depositos = filtered.map(r => r.depositos_tratados)
  const promCob = filtered.map(r => Number(r.prom_cobertura_por_manzana.toFixed(2)))

  return { labels, casas, depositos, promCob }
}

function renderChart({labels, casas, depositos, promCob}){
  const ctx = larvaChart.value.getContext('2d')
  if(chartInstance) chartInstance.destroy()
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Casas trabajadas',
          data: casas,
          yAxisID: 'y1',
          backgroundColor: 'rgba(54,162,235,0.7)'
        },
        {
          label: 'Depósitos tratados',
          data: depositos,
          yAxisID: 'y1',
          backgroundColor: 'rgba(255,159,64,0.7)'
        },
        {
          label: 'Promedio cobertura por manzana',
          data: promCob,
          type: 'line',
          yAxisID: 'y2',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2,
          tension: 0.2,
          fill: false,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: { mode: 'index', intersect: false },
        legend: { position: 'top' }
      },
      scales: {
        y1: { type: 'linear', position: 'left', title: {display:true, text:'Cantidad (casas/depositos)'} },
        y2: { type: 'linear', position: 'right', title: {display:true, text:'Promedio cobertura por manzana'}, grid: { drawOnChartArea: false } }
      }
    }
  })
}

onMounted(() => { fetchData() })
</script>

