verificarToken()
verificarRol("asesor")

const params = new URLSearchParams(window.location.search)
const usuarioId = params.get("userId")
const usuarioNombre = params.get("nombre")

document.getElementById("user-target").textContent = usuarioNombre || `Usuario #${usuarioId}`

document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = ROUTES.getPath("../index.html")
})

document.getElementById("recommendation-form").addEventListener("submit", async function(e) {
    e.preventDefault()
    const mensaje = document.getElementById("mensaje").value
    if (!mensaje.trim()) {
        alert("Escribí una recomendación")
        return
    }
    try {
        await sendRecommendation(mensaje, usuarioId)
        alert("Recomendación enviada correctamente")
        window.location.href = ROUTES.getPath("users.html")
    } catch (error) {
        alert("Error: " + error.message)
    }
})