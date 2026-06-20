/**
 * components.js — Componentes reutilizables del frontend
 */

/**
 * Redirige al login detectando si estamos en una subcarpeta.
 * En /advisor/cualquiercosa.html usa ../index.html
 * En cualquier otra página usa index.html
 */
function irALogin() {
    // Detecta si la ruta tiene más de un segmento (ej: /advisor/dashboard.html)
    const enSubcarpeta = window.location.pathname.split('/').filter(Boolean).length > 1;
    window.location.href = enSubcarpeta ? '../index.html' : 'index.html';
}

/**
 * Marca como activo el link del sidebar cuyo nombre de archivo
 * coincide con la página actual.
 */
function marcarNavItemActivo() {
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.cg-nav-item').forEach(function (item) {
        const nombreArchivo = item.getAttribute('href').split('/').pop();
        if (nombreArchivo === paginaActual) {
            item.classList.add('active');
        }
    });
}

/**
 * Inyecta el sidebar en el DOM reemplazando #sidebar-container,
 * luego marca el ítem activo y registra el logout.
 */
function _montarSidebar(html) {
    const contenedor = document.getElementById('sidebar-container');
    if (contenedor) {
        contenedor.outerHTML = html;
    }
    marcarNavItemActivo();
    const btn = document.getElementById('logout-btn');
    if (btn) {
        btn.addEventListener('click', function () {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            irALogin();
        });
    }
}

/**
 * Sidebar para usuarios regulares.
 * Los links son relativos al nombre de archivo solamente,
 * lo que funciona siempre que todas las páginas de usuario
 * estén en la misma carpeta.
 */
function cargarSidebarUsuario() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    _montarSidebar(`
        <aside class="cg-sidebar">
            <div class="cg-logo">
                <div class="cg-logo-icon">$</div>
                <div class="cg-logo-text">Ctrl<span>Gasto</span></div>
            </div>
            <div class="cg-user">
                <div class="cg-user-name">${user.name || 'Usuario'}</div>
            </div>
            <nav class="cg-nav">
                <a href="dashboard.html" class="cg-nav-item">🏠 Dashboard</a>
                <a href="expenses.html" class="cg-nav-item">📊 Gastos</a>
                <a href="upload.html" class="cg-nav-item">📤 Subir</a>
                <a href="reports.html" class="cg-nav-item">📈 Reportes</a>
                <a href="recommendations.html" class="cg-nav-item">💡 Recomendaciones</a>
                <a href="profile.html" class="cg-nav-item">👤 Mi Perfil</a>
            </nav>
            <button id="logout-btn" class="cg-logout">Cerrar sesión</button>
        </aside>
    `);
}

/**
 * Sidebar para asesores financieros.
 * Los links también son solo nombres de archivo, lo que funciona
 * porque todas las páginas del asesor están en la misma carpeta /advisor/.
 */
function cargarSidebarAsesor() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    _montarSidebar(`
        <aside class="cg-sidebar">
            <div class="cg-logo">
                <div class="cg-logo-icon">$</div>
                <div class="cg-logo-text">Ctrl<span>Gasto</span></div>
            </div>
            <div class="cg-user">
                <div class="cg-user-name">${user.name || 'Asesor'}</div>
            </div>
            <nav class="cg-nav">
                <a href="dashboard.html" class="cg-nav-item">🏠 Panel</a>
                <a href="users.html" class="cg-nav-item">👥 Usuarios</a>
                <a href="profile.html" class="cg-nav-item">👤 Mi Perfil</a>
            </nav>
            <button id="logout-btn" class="cg-logout">Cerrar sesión</button>
        </aside>
    `);
}
