export const controlLarvario = [
    // id_larvario, id_manzana, id_colonia, id_sector, fecha, casas_trabajadas, depositos_inspeccionados, depositos_positivos, depositos_tratados, habitantes_beneficiados, promedio_cobertura, responsable
];

for (let i = 1; i <= 15; i++) {
    controlLarvario.push({
        id_larvario: i,
        id_manzana: i,
        id_colonia: i,
        id_sector: i,
        fecha: '28/10/2025',
        casas_trabajadas: Math.floor(Math.random() * 50) + 50, // 50-100 casas
        depositos_inspeccionados: Math.floor(Math.random() * 100) + 50, // 50-150 depósitos
        depositos_positivos: Math.floor(Math.random() * 30), // 0-30 positivos
        depositos_tratados: Math.floor(Math.random() * 30),
        habitantes_beneficiados: Math.floor(Math.random() * 300) + 50,
        promedio_cobertura: parseFloat((Math.random() * 50 + 50).toFixed(2)), // 50-100%
        responsable: 'Brigada ' + i
    });
}