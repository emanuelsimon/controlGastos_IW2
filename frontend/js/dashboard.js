/* Este archivo se encarga de manejar la lógica del dashboard, como mostrar el nombre del usuario, 
cargar los gastos, etc. */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()

verificarRol("usuario")

//Convierto el string JSON que tengo guardado en localStorage a un objeto javascript para poder usarlo en el dashboard
let user = JSON.parse(localStorage.getItem("user"))

// Mostramos el nombre del usuario en el dashboard
document.getElementById("user-name").textContent = user.name 

if (user.rol === "asesor") {
    // Redirigir al panel del asesor
    window.location.href = "advisor/dashboard.html"
}

document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "index.html"
})