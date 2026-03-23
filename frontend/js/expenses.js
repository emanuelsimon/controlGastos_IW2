/* expenses.js - Lógica para la página de visualización de gastos */

/* Verificar si el usuario tiene un token válido en localStorage, sino lo redirigimos al login */
let token = localStorage.getItem("token")
if (!token) {
    window.location.href = "index.html"
}


document.getElementById("inicio-btn").addEventListener("click", function() {
    window.location.href = "dashboard.html"
})



let filterBtns = document.querySelectorAll(".filter-btn")
/*Al cargar la pagina le agrega a cada boton la funcion "addEventListener" y si alguno recibe un click se ejecuta la funcion
    que saca la clase .active de todos los botones y solo la activa en el boton clickeado */
filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        // Sacar .active de todos los botones
        filterBtns.forEach(function(b) {
            b.classList.remove("active")
        })
        // Agregar .active solo al que clickeaste
        btn.classList.add("active")
    })
})