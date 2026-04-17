/* Este archivo se encarga de manejar la lógica del dashboard, como mostrar el nombre del usuario, 
cargar los gastos, etc. */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()


//Convierto el string JSON que tengo guardado en localStorage a un objeto javascript para poder usarlo en el dashboard
let user = JSON.parse(localStorage.getItem("user"))
console.log(user)

// Mostramos el nombre del usuario en el dashboard
document.getElementById("user-name").textContent = user.name 

//Funcion agregada al boton de logout, al hacer click se borra el token y el usuario del localStorage 
//redirigiendo al usuario a la página de login (index.html).
document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "../index.html"
})