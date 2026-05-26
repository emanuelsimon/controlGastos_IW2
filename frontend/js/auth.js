
/**Escuchamos el evento de envío del formulario de login */

const loginForm = document.getElementById("login-form")
if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault()
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value

        const data = await loginUser(email, password)
        console.log(data)
        
        if (data.token) {
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            if (data.user.rol === "asesor") {
                window.location.href = "advisor/dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } else {
            alert("Email o contraseña incorrectos")
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
            alert("Error al registrarse: " + error.message)
        }
    })
}