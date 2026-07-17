cargarSidebarUsuario();

/* budgets.js - Presupuestos y metas de ahorro */

verificarToken();

const CATEGORIAS = ['Alimentación','Combustible','Salud','Ocio','Transporte','Educación','Hogar','Ropa','Servicios','Otro'];

// Cargar valores guardados en inputs al inicio
document.getElementById('input-presupuesto-total').value = localStorage.getItem('cg_presupuesto_mensual') || '';
document.getElementById('input-meta-ahorro').value = localStorage.getItem('cg_meta_ahorro') || '';

function guardarPresupuestoGeneral() {
    const presupuesto = document.getElementById('input-presupuesto-total').value;
    const meta        = document.getElementById('input-meta-ahorro').value;
    if (presupuesto) localStorage.setItem('cg_presupuesto_mensual', presupuesto);
    if (meta)        localStorage.setItem('cg_meta_ahorro', meta);
    alert('Guardado correctamente');
}

async function cargarPresupuestos() {
    const resultado = await getExpenses();
    const gastos = resultado.data;
    const ahora  = new Date();

    // Filtrar gastos del mes actual
    const gastosEsteMes = gastos.filter(g => {
        const f = new Date(g.fecha);
        return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
    });

    // Agrupar gastos por categoría
    const gastadoPorCat = {};
    gastosEsteMes.forEach(g => {
        gastadoPorCat[g.categoria] = (gastadoPorCat[g.categoria] || 0) + Number(g.monto);
    });

    const grid = document.getElementById('budgets-grid');
    grid.innerHTML = '';

    CATEGORIAS.forEach(cat => {
        const presupuesto = parseFloat(localStorage.getItem(`cg_budget_${cat}`)) || 0;
        const gastado     = gastadoPorCat[cat] || 0;
        const pct         = presupuesto > 0 ? Math.min(100, Math.round((gastado / presupuesto) * 100)) : 0;
        const fillClass   = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : '';

        grid.innerHTML += `
            <div class="cg-budget-card">
                <h3>${cat}</h3>
                <div class="cg-budget-amounts">
                    Gastado: <span>$${gastado.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                    ${presupuesto ? ` / $${presupuesto.toLocaleString('es-AR')}` : ''}
                </div>
                ${presupuesto ? `
                <div class="cg-progress-bar">
                    <div class="cg-progress-fill ${fillClass}" style="width:${pct}%"></div>
                </div>
                <div style="font-size:11px;color:#64748b;margin-top:4px">${pct}% del presupuesto</div>` : ''}
                <div class="cg-field" style="margin-top:10px;margin-bottom:0">
                    <label>Presupuesto mensual ($)</label>
                    <input type="number" value="${presupuesto || ''}" placeholder="Sin límite"
                        onchange="guardarPresupuestoCat('${cat}', this.value)">
                </div>
            </div>`;
    });
}

function guardarPresupuestoCat(categoria, valor) {
    if (valor) {
        localStorage.setItem(`cg_budget_${categoria}`, valor);
    } else {
        localStorage.removeItem(`cg_budget_${categoria}`);
    }
    cargarPresupuestos(); // re-render para actualizar la barra
}

cargarPresupuestos();
