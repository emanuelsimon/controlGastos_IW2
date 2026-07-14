cargarSidebarUsuario();

/* reports.js - Reportes, patrones, comparación y ranking */

verificarToken();

const CHART_OPTS = {
    legend: { labels: { color: '#94a3b8', font: { family: 'DM Sans', size: 11 } } }
};
const AXIS_OPTS = {
    x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
    y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } }
};

async function cargarReportes() {
    const data = await getReportsData();

    // Gráfico 1 — Torta por categoría
    new Chart(document.getElementById('grafico-categorias'), {
        type: 'pie',
        data: {
            labels: data.categorias.labels,
            datasets: [{ data: data.categorias.datos, backgroundColor: ['#447799','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#e91e63','#3498db','#95a5a6'] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: CHART_OPTS }
    });

    // Gráfico 2 — Barras por mes
    new Chart(document.getElementById('grafico-meses'), {
        type: 'bar',
        data: {
            labels: data.meses.labels,
            datasets: [{ label: 'Gastos por mes', data: data.meses.datos, backgroundColor: '#447799' }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: CHART_OPTS, scales: AXIS_OPTS }
    });

    // Gráfico 3 — Ranking comercios
    new Chart(document.getElementById('grafico-comercios'), {
        type: 'bar',
        data: {
            labels: data.comercios.labels,
            datasets: [{ label: 'Monto total', data: data.comercios.datos, backgroundColor: '#2ecc71' }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: CHART_OPTS, scales: AXIS_OPTS }
    });

    // Punto 6 — Comparación mes actual vs mes anterior
    renderComparacion(data.meses);

    // Punto 7 — Análisis de patrones
    renderPatrones(data);

    // Punto 8 — Ranking de comercios como lista
    renderRanking(data.comercios);
}

// Punto 6 — Comparación entre meses
function renderComparacion(meses) {
    const contenedor = document.getElementById('comparacion-meses');
    if (!contenedor || !meses.labels.length) return;

    const labels = meses.labels;
    const datos  = meses.datos;
    const n      = labels.length;

    if (n < 2) {
        contenedor.innerHTML = '<p style="color:#64748b;font-size:13px">Necesitás al menos 2 meses de gastos para ver la comparación.</p>';
        return;
    }

    const actual   = datos[n - 1];
    const anterior = datos[n - 2];
    const diff     = actual - anterior;
    const pct      = anterior > 0 ? ((diff / anterior) * 100).toFixed(1) : '—';
    const diffClass = diff > 0 ? 'diff-pos' : 'diff-neg';
    const diffText  = diff > 0 ? `▲ ${pct}% más que el mes anterior` : `▼ ${Math.abs(pct)}% menos que el mes anterior`;

    contenedor.innerHTML = `
        <div class="cg-comparison-row">
            <div class="cg-comparison-stat">
                <div class="label">${labels[n - 2]}</div>
                <div class="value">$${Number(anterior).toLocaleString('es-AR')}</div>
            </div>
            <div class="cg-comparison-stat">
                <div class="label">${labels[n - 1]} (este mes)</div>
                <div class="value">$${Number(actual).toLocaleString('es-AR')}</div>
                <div class="${diffClass}">${diffText}</div>
            </div>
        </div>`;
}

// Punto 7 — Patrones de consumo
function renderPatrones(data) {
    const contenedor = document.getElementById('patrones-consumo');
    if (!contenedor) return;

    // Categoría dominante
    const catIdx = data.categorias.datos.indexOf(Math.max(...data.categorias.datos));
    const catDom = data.categorias.labels[catIdx] || '—';

    // Mes de mayor gasto
    const mesIdx = data.meses.datos.indexOf(Math.max(...data.meses.datos));
    const mesMayor = data.meses.labels[mesIdx] || '—';

    // Promedio mensual
    const promMensual = data.meses.datos.length
        ? (data.meses.datos.reduce((a, b) => a + b, 0) / data.meses.datos.length).toFixed(0)
        : 0;

    // Comercio más frecuente (top 1 del ranking)
    const comercioTop = data.comercios.labels[0] || '—';

    contenedor.innerHTML = `
        <ul class="cg-pattern-list">
            <li>Categoría donde más gastás <span>${catDom}</span></li>
            <li>Mes de mayor gasto <span>${mesMayor}</span></li>
            <li>Promedio mensual <span>$${Number(promMensual).toLocaleString('es-AR')}</span></li>
            <li>Comercio más frecuente <span>${comercioTop}</span></li>
        </ul>`;
}

// Punto 8 — Ranking de comercios como lista con barras visuales
function renderRanking(comercios) {
    const contenedor = document.getElementById('ranking-comercios');
    if (!contenedor || !comercios.labels.length) return;

    const max = Math.max(...comercios.datos);
    const items = comercios.labels.map((label, i) => {
        const pct = max > 0 ? (comercios.datos[i] / max * 100).toFixed(0) : 0;
        return `
            <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;font-size:13px;color:#94a3b8;margin-bottom:4px">
                    <span>${i + 1}. ${label}</span>
                    <span style="color:#f1f5f9">$${Number(comercios.datos[i]).toLocaleString('es-AR')}</span>
                </div>
                <div class="cg-progress-bar">
                    <div class="cg-progress-fill" style="width:${pct}%"></div>
                </div>
            </div>`;
    }).join('');
    contenedor.innerHTML = items;
}

cargarReportes();
