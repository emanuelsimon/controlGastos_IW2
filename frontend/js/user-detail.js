// Función para verificar los gastos del usuario

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()
// Verificar que el usuario tenga el rol de asesor
verificarRol("asesor")

// Agrego el Listener para volver al inicio
document.getElementById("inicio-btn").addEventListener("click", function() {
    window.location.href = "dashboard.html"
})

let params = new URLSearchParams(window.location.search)
let userId = params.get("id")
console.log(userId) // Verficamos que el ID se esté obteniendo correctamente

//Harcodeamos el nombre del usuario por ahora, luego lo reemplazaremos por 
// el nombre real obtenido de la API
document.getElementById("user-name").textContent = "Juan Pérez"

