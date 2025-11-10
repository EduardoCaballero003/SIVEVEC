<template>
    <div v-if="visible" class="custom-modal p-0" :style="{ top: position.top + 'px', left: position.left + 'px' }"
        @mousedown="startDrag">
        <!-- Header arrastrable -->
        <div
            class="modal-header bg-success rounded-top-3 text-white d-flex justify-content-between align-items-center p-2">
            <h5 class="m-0 ps-2">{{ tipe.toLocaleLowerCase() + ' ' + sector.name  }}</h5>
            <button @click="close" class="btn-close p-2"></button>
        </div>

        <!-- Contenido -->
        <div class="modal-body p-2">
          <div class="actions" v-if="tipe == 'acciones'">
            ewe
          </div>

          <div class="actions row m-0 p-0" v-if="tipe == 'histograma'">
            <div class="col-12 m-0 p-0 mb-2">
              <div class="row m-0 p-0">

                <div class="col-4 m-0 p-1">
                  <div class="rounded border border-terciary p-2">
                    col-1
                  </div>
                </div>

                <div class="col-4 m-0 p-1">
                  <div class="rounded border border-terciary p-2">
                    col-1
                  </div>
                </div>

                <div class="col-4 m-0 p-1">
                  <div class="rounded border border-terciary p-2">
                    col-1
                  </div>
                </div>

              </div>
            </div>

            <div class="col-12 m-0 p-1">
              <div class="rounded border border-terciary m-0 p-2">
                we
              </div>
            </div>
          </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Props reutilizables
defineProps({
    visible: { type: Boolean, default: false },
    sector: { type: Object, default: () => ({}) },
    tipe: {type: String, default:''}
})

// Emit para cerrar el modal
const emit = defineEmits(['update:visible'])

// Posición inicial del modal
const position = ref({ top: 560, left: 330 })
let isDragging = false
let dragOffset = { x: 0, y: 0 }

const startDrag = (e) => {
    if (!e.target.closest('.modal-header')) return // Solo arrastrar desde el header
    isDragging = true
    dragOffset.x = e.clientX - position.value.left
    dragOffset.y = e.clientY - position.value.top
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
    if (!isDragging) return
    position.value.left = e.clientX - dragOffset.x
    position.value.top = e.clientY - dragOffset.y
}

const stopDrag = () => {
    isDragging = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
}

const close = () => {
    emit('update:visible', false)
}
</script>

<style scoped>
.bg-success {
    background-color: #00796B !important;
}

.modal-header {
    cursor: move;
}

.custom-modal {
    position: fixed;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    min-width: 350px;
    max-width: 30%;
    cursor: default;
    user-select: none;
    z-index: 2000;
    /* Mantiene el modal por encima del contenido sin bloquearlo */
}

.btn-close {
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>
