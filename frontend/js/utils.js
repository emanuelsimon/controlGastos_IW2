function verificarToken() {
    let token = localStorage.getItem("token")
    if (!token) {
        window.location.href = "/frontend/index.html"
    }
}

function verificarRol(rolRequerido) {
    let user = JSON.parse(localStorage.getItem("user"))
    if (user.rol !== rolRequerido) {
        window.location.href = "/frontend/dashboard.html"
    }
}


function activarMenu() {
    document.querySelectorAll(".cg-nav-item").forEach(link => {
        const page = link.getAttribute("href")
        if (window.location.pathname.endsWith(page)) {
            link.classList.add("active")
        }
    })
}

function mostrarUsuario() {
    const user = JSON.parse(localStorage.getItem("user"))
    const el = document.getElementById("user-name")

    if (user && el) {
        el.textContent = user.name
    }
}

document.addEventListener("DOMContentLoaded", () => {
    activarMenu()
    mostrarUsuario()
})