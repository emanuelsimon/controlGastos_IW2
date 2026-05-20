verificarToken()

document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "index.html"
})

// Pre-completar con datos actuales
const user = JSON.parse(localStorage.getItem("user"))
document.getElementById("nombre").value = user.name || ''
document.getElementById("email").value = user.email || ''

document.getElementById("profile-form").addEventListener("submit", async function(e) {
    e.preventDefault()

    const datos = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
    }

    const password = document.getElementById("password").value
    if (password) {
        datos.password = password
    }

    try {
        const updated = await updateProfile(datos)
        // Actualizar localStorage con los nuevos datos
        const userActual = JSON.parse(localStorage.getItem("user"))
        userActual.name = updated.nombre
        userActual.email = updated.email
        localStorage.setItem("user", JSON.stringify(userActual))
        alert("Perfil actualizado correctamente")
    } catch (error) {
        alert("Error: " + error.message)
    }
})