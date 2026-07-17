cargarSidebarUsuario();

/* dashboard.js - Panel principal */

verificarToken();
verificarRol('usuario');

let user = JSON.parse(localStorage.getItem('user'));

if (user && user.rol === 'asesor') {
    window.location.href = 'advisor/dashboard.html';
}

// Perfil financiero y Meta de ahorro
async function cargarDashboard() {
    try {
        const resultado = await getExpenses();
        const gastos = resultado.data;

        // Perfil financiero
        const perfil = calcularPerfilFinanciero(gastos);
        const perfilEl = document.getElementById('perfil-financiero');
        if (perfilEl) {
            const iconos = { 'Consumidor impulsivo': '🔴', 'Consumidor equilibrado': '🟡', 'Consumidor ahorrador': '🟢', 'Sin datos': '⚪' };
            perfilEl.innerHTML = `
                <div class="cg-profile-card">
                    <div class="cg-profile-icon" style="background:${perfil.color}22">
                        ${iconos[perfil.tipo] || '💰'}
                    </div>
                    <div>
                        <div class="cg-profile-tipo" style="color:${perfil.color}">${perfil.tipo}</div>
                        <div class="cg-profile-desc">${perfil.descripcion}</div>
                    </div>
                </div>`;
        }

        // Meta de ahorro
        const metaEl = document.getElementById('meta-ahorro');
        if (metaEl) {
            const meta = parseFloat(localStorage.getItem('cg_meta_ahorro'));
            if (meta) {
                const ahora = new Date();
                const gastadoEsteMes = gastos
                    .filter(g => {
                        const f = new Date(g.fecha);
                        return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
                    })
                    .reduce((sum, g) => sum + Number(g.monto), 0);
                const ahorrado = Math.max(0, meta - gastadoEsteMes);
                const pct = Math.min(100, Math.round((ahorrado / meta) * 100));
                metaEl.innerHTML = `
                    <div class="cg-goal-card">
                        <h2>🎯 Meta de ahorro mensual</h2>
                        <div class="cg-goal-stat">$${ahorrado.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
                        <div class="cg-goal-desc">ahorrado de $${meta.toLocaleString('es-AR')} (${pct}% de tu meta)</div>
                        <div class="cg-progress-bar" style="margin-top:12px">
                            <div class="cg-progress-fill ${pct >= 100 ? '' : pct >= 50 ? 'warning' : 'danger'}" style="width:${pct}%"></div>
                        </div>
                    </div>`;
            } else {
                metaEl.innerHTML = `
                    <div class="cg-goal-card">
                        <h2>🎯 Meta de ahorro</h2>
                        <p style="color:#64748b;font-size:14px">Definí tu meta mensual en <a href="budgets.html" style="color:#2563eb">Presupuestos</a>.</p>
                    </div>`;
            }
        }

    } catch (e) {
        console.error('Error cargando dashboard:', e);
    }
}

cargarDashboard();
