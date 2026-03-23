/* Este archivo se encarga de manejar la lógica del dashboard, como mostrar el nombre del usuario, 
cargar los gastos, etc. */

/* Verificar si el usuario tiene un token válido en localStorage, sino lo redirigimos al login */
let token = localStorage.getItem("token")
if (!token) {
    window.location.href = "index.html"
}

//Convierto el string JSON que tengo guardado en localStorage a un objeto javascript para poder usarlo en el dashboard
let user = JSON.parse(localStorage.getItem("user"))
console.log(user)

//Con "textContent" escribimos texto dentro de un elemento HTML desde JS
document.getElementById("user-name").textContent = user.name

document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "index.html"
})