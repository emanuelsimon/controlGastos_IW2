
/**Escuchamos el evento de envío del formulario de login */

const loginForm = document.getElementById("login-form")
if (loginForm) {
    // Ocultar el mensaje de error cuando el usuario modifica los campos
    loginForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const errorEl = document.getElementById("login-error")
            if (errorEl) errorEl.style.display = "none"
        })
    })

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        
        const errorEl = document.getElementById("login-error")

        try {
            const data = await loginUser(email, password)

            if (data.token) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))

                if (data.user.rol === "asesor") {
                    window.location.href = "advisor/dashboard.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            }
        } catch (error) {
            if (errorEl) errorEl.style.display = "block"
        }
    })
}

const registerForm = document.getElementById("register-form")
if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault()

        const nombre = document.getElementById("name").value
        const apellido = document.getElementById("lastname").value
        const dni = document.getElementById("dni").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const confirmPassword = document.getElementById("confirm-password").value
        const rol = document.getElementById("rol").value

        // Validación de contraseña
        if (password.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres")
            return
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden")
            return
        }

        try {
            await registerUser(nombre, apellido, dni, email, password, rol)
            alert("Cuenta creada correctamente")
            window.location.href = "index.html"
        } catch (error) {
            alert(error.message || "Error al registrarse. Revisá los datos e intentá de nuevo.")
        }
    })
}