cargarSidebarAsesor();

/* advisor-dashboard.js - Panel avanzado del asesor */

verificarToken();

async function cargarPanelAsesor() {
    try {
        const [usuariosResp] = await Promise.all([getUsers()]);
        const usuarios = usuariosResp || [];

        // Cargar gastos de todos los usuarios (usando el endpoint /expenses/all)
        // que ya existe en el backend con rol asesor
        const gastosTodos = await getAllExpenses();

        // Estadísticas globales
        const totalGastado = gastosTodos.reduce((sum, g) => sum + Number(g.monto), 0);
        const promedioGasto = gastosTodos.length ? (totalGastado / gastosTodos.length) : 0;

        // Categoría más común globalmente
        const catCount = {};
        gastosTodos.forEach(g => { catCount[g.categoria] = (catCount[g.categoria] || 0) + 1; });
        const catTop = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

        // Usuario con más gasto
        const gastoPorUser = {};
        gastosTodos.forEach(g => {
            const uid = g.user?.id;
            if (uid) gastoPorUser[uid] = (gastoPorUser[uid] || 0) + Number(g.monto);
        });
        const topUserId = Object.entries(gastoPorUser).sort((a, b) => b[1] - a[1])[0]?.[0];
        const topUser = usuarios.find(u => String(u.id) === String(topUserId));
        const topUserNombre = topUser ? `${topUser.nombre} ${topUser.apellido}` : '—';

        // Render stats
        document.getElementById('stats-grid').innerHTML = `
            <div class="cg-stat-card">
                <div class="cg-stat-label">Usuarios registrados</div>
                <div class="cg-stat-value">${usuarios.length}</div>
            </div>
            <div class="cg-stat-card">
                <div class="cg-stat-label">Total gastos registrados</div>
                <div class="cg-stat-value">${gastosTodos.length}</div>
            </div>
            <div class="cg-stat-card">
                <div class="cg-stat-label">Total gastado (todos)</div>
                <div class="cg-stat-value">$${totalGastado.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
            </div>
            <div class="cg-stat-card">
                <div class="cg-stat-label">Promedio por gasto</div>
                <div class="cg-stat-value">$${promedioGasto.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
            </div>
            <div class="cg-stat-card">
                <div class="cg-stat-label">Categoría más frecuente</div>
                <div class="cg-stat-value" style="font-size:16px">${catTop}</div>
            </div>
            <div class="cg-stat-card">
                <div class="cg-stat-label">Mayor gastador</div>
                <div class="cg-stat-value" style="font-size:16px">${topUserNombre}</div>
                <div class="cg-stat-sub">$${(gastoPorUser[topUserId] || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
            </div>`;

    } catch (e) {
        console.error('Error cargando panel asesor:', e);
        document.getElementById('stats-grid').innerHTML = '<p style="color:#64748b">Error al cargar estadísticas.</p>';
    }
}

cargarPanelAsesor();
