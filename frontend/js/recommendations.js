cargarSidebarUsuario();

/* recommendations.js - Recomendaciones del asesor + automáticas por IA */

verificarToken();

async function cargarRecomendaciones() {
    const contenedor = document.getElementById('recommendations-list');

    try {
        // Historial de recomendaciones del asesor
        const recs = await getRecommendations();

        // Recomendaciones automáticas basadas en patrones
        const resultado = await getExpenses();
        const gastos = resultado.data;
        const recsAutomaticas = generarRecomendacionesAutomaticas(gastos);

        let html = '';

        // Bloque de recomendaciones automáticas
        if (recsAutomaticas.length) {
            html += `<h2 style="font-size:15px;color:#94a3b8;margin-bottom:12px">💡 Análisis automático</h2>`;
            recsAutomaticas.forEach(r => {
                html += `<div class="cg-auto-rec"><span class="cg-auto-rec-icon">${r.icono}</span><span>${r.texto}</span></div>`;
            });
            html += `<hr style="border:none;border-top:0.5px solid #2e3a52;margin:1.5rem 0">`;
        }

        // Bloque del historial del asesor
        html += `<h2 style="font-size:15px;color:#94a3b8;margin-bottom:12px">📋 Recomendaciones de tu asesor</h2>`;
        if (!recs.length) {
            html += `<p style="color:#64748b;font-size:14px">Todavía no tenés recomendaciones de tu asesor.</p>`;
        } else {
            // Ordenar por fecha descendente (más reciente primero)
            recs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            recs.forEach(r => {
                const fecha = new Date(r.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
                html += `
                    <div style="background:#1a2236;border:0.5px solid #2e3a52;border-radius:10px;padding:14px 16px;margin-bottom:10px">
                        <p style="font-size:14px;color:#e2e8f0;margin-bottom:6px">${r.mensaje}</p>
                        <p style="font-size:12px;color:#64748b">${fecha}</p>
                    </div>`;
            });
        }

        contenedor.innerHTML = html;

    } catch (error) {
        contenedor.innerHTML = `<p style="color:#ef4444">Error al cargar recomendaciones: ${error.message}</p>`;
    }
}

// Lógica de recomendaciones automáticas basadas en los gastos del usuario
function generarRecomendacionesAutomaticas(gastos) {
    if (!gastos || gastos.length === 0) return [];

    const recs = [];
    const totales = {};
    let totalGeneral = 0;

    gastos.forEach(g => {
        totales[g.categoria] = (totales[g.categoria] || 0) + Number(g.monto);// Sumar el monto del gasto a la categoría correspondiente
        totalGeneral += Number(g.monto);
    });

    // Función para calcular el porcentaje de gasto por categoría
    const pct = cat => totales[cat] ? (totales[cat] / totalGeneral * 100) : 0; 

    if (pct('Ocio') > 30) {
        recs.push({ icono: '🎭', texto: `Estás gastando el ${pct('Ocio').toFixed(0)}% de tu dinero en ocio. Considerá reducirlo al 20% para mejorar tu ahorro.` });
    }
    if (pct('Alimentación') > 50) {
        recs.push({ icono: '🛒', texto: `Más de la mitad de tus gastos son en alimentación. Planificar las compras semanalmente puede ayudarte a bajar este número.` });
    }

    // Detectar si gasta mucho en servicios de streaming/suscripciones
    const gastosComercios = {};
    gastos.forEach(g => { gastosComercios[g.comercio.toLowerCase()] = (gastosComercios[g.comercio.toLowerCase()] || 0) + 1; });
    const suscripciones = Object.keys(gastosComercios).filter(c => ['netflix','spotify','disney','hbo','steam'].some(s => c.includes(s)));
    if (suscripciones.length >= 3) {
        recs.push({ icono: '📺', texto: `Tenés ${suscripciones.length} suscripciones activas. Revisá cuáles realmente usás para optimizar ese gasto.` });
    }

    // Promedio mensual
    const meses = {};
    gastos.forEach(g => { 
        const f = new Date(g.fecha);
        const k = `${f.getFullYear()}-${f.getMonth()}`; //Obtiene el año y mes del gasto para agruparlos
        meses[k] = (meses[k] || 0) + Number(g.monto);
    });
    const promedioMensual = Object.values(meses).length
        ? Object.values(meses).reduce((a, b) => a + b, 0) / Object.values(meses).length
        : 0;

    if (promedioMensual > 0) {
        recs.push({ icono: '📊', texto: `Tu gasto promedio mensual es $${promedioMensual.toLocaleString('es-AR', { maximumFractionDigits: 0 })}. Establecer un presupuesto mensual puede ayudarte a mantenerlo bajo control.` });
    }

    if (recs.length === 0) {
        recs.push({ icono: '✅', texto: 'Tus hábitos de gasto se ven saludables. ¡Seguí así!' });
    }

    return recs;
}

cargarRecomendaciones();
