function cargarSidebarUsuario() {
    const user = JSON.parse(localStorage.getItem("user")) || {}
    const sidebar = `
    <div class="cg-app">
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
        </div>
        </div>
    `
    document.getElementById("sidebar-container").innerHTML = sidebar
}

function cargarSidebarAsesor(basePath = '') {
    const user = JSON.parse(localStorage.getItem("user")) || {}
    const sidebar = `
    <div class="cg-app">
        <aside class="cg-sidebar">
            <div class="cg-logo">
                <div class="cg-logo-icon">$</div>
                <div class="cg-logo-text">Ctrl<span>Gasto</span></div>
            </div>
            <div class="cg-user">
                <div class="cg-user-name">${user.name || 'Asesor'}</div>
            </div>
            <nav class="cg-nav">
                <a href="${basePath}dashboard.html" class="cg-nav-item">🏠 Dashboard</a>
                <a href="${basePath}users.html" class="cg-nav-item">👥 Usuarios</a>
                <a href="${basePath}profile.html" class="cg-nav-item">👤 Mi Perfil</a>
            </nav>
            <button id="logout-btn" class="cg-logout">Cerrar sesión</button>
        </aside>
    </div>
    `
    document.getElementById("sidebar-container").innerHTML = sidebar
}