// Datos de ovitrampas simulados
export const ovitrampas = [];
for (let i = 1; i <= 15; i++) {
    ovitrampas.push({
        id_ovitrampa: i,
        id_manzana: i,
        id_colonia: i,
        id_sector: i,
        fecha_instalacion: '21/10/2025',
        fecha_recoleccion: '28/10/2025',
        huevos_contados: Math.floor(Math.random() * 200), // 0-200 huevos
        promedio_huevos: parseFloat((Math.random() * 100).toFixed(2)), // 0-100
        positiva: Math.random() > 0.5,
        responsable: 'Brigada ' + i
    });
}