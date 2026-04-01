// Verificar que el usuario esté autenticado al cargar la página
verificarToken()
// Verificar que el usuario tenga el rol de asesor
verificarRol("asesor")

// Agrego el Listener para volver al inicio
document.getElementById("inicio-btn").addEventListener("click", function() {
    window.location.href = "dashboard.html"
})

