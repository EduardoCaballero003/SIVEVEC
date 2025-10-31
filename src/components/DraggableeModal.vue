<template>
    <div v-if="visible" class="custom-modal p-0" :style="{ top: position.top + 'px', left: position.left + 'px' }"
        @mousedown="startDrag">
        <!-- Header arrastrable -->
        <div
            class="modal-header bg-success rounded-top-3 text-white d-flex justify-content-between align-items-center p-2">
            <h5 class="m-0">{{ title }}</h5>
            <button @click="close" class="btn btn-sm btn-light">✕</button>
        </div>

        <!-- Contenido -->
        <div class="modal-body p-3">{{ sector }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Props reutilizables
defineProps({
    title: { type: String, default: 'Modal' },
    visible: { type: Boolean, default: false },
    sector: { type: Object, default: () => ({}) }
})

// Emit para cerrar el modal
const emit = defineEmits(['update:visible'])

// Posición inicial del modal
const position = ref({ top: 150, left: 200 })
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
</style>
