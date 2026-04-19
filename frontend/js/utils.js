function verificarToken() {
    let token = localStorage.getItem("token")
    if (!token) {
        window.location.href = "/frontend/index.html"
    }
}

//Esta función se usa ahora, pero una vez que tengamos el backend funcionando, 
// es hacer una verificacion mediante API para asegurarnos que el token es válido y no ha expirado. 
// Por ahora, solo verificamos que exista.
function verificarRol(rolRequerido) {
    let user = JSON.parse(localStorage.getItem("user"))
    if (user.rol !== rolRequerido) {
        if (user.rol === "asesor") {
            window.location.href = "/frontend/advisor/dashboard.html"
        } else {
            window.location.href = "/frontend/dashboard.html"
        }
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


//Funcion agregada al boton de logout, al hacer click se borra el token y el usuario del localStorage 
//redirigiendo al usuario a la página de login (index.html).
document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/frontend/index.html"
})



function inicializarTabla(getData, renderFila, filtros) {
    let allData = []

    async function cargar() {
        allData = await getData()
        renderTabla(allData)
    }

    function renderTabla(datos) {
        const tbody = document.querySelector("tbody")
        tbody.innerHTML = ""
        datos.forEach(item => {
            tbody.innerHTML += renderFila(item)
        })
    }

    function aplicarFiltro(filtro) {
        let datos = [...allData]
        if (filtros[filtro]) {
            datos = filtros[filtro](datos)
        }
        renderTabla(datos)
    }

    document.querySelectorAll(".cg-filter").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".cg-filter").forEach(b => b.classList.remove("active"))
            btn.classList.add("active")
            aplicarFiltro(btn.textContent.trim())
        })
    })

    cargar()
}