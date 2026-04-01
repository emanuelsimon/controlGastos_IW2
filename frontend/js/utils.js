function verificarToken() {
    let token = localStorage.getItem("token")
    if (!token) {
        window.location.href = "index.html"
    }
}

function verificarRol(rolRequerido) {
    let user = JSON.parse(localStorage.getItem("user"))
    if (user.rol !== rolRequerido) {
        window.location.href = "dashboard.html"
    }
}