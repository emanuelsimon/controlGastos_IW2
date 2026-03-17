
/**Escuchamos el evento de envío del formulario de login */
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault() // esto evita que la página se recargue
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    /* Llamamos a la función loginUser del archivo api.js para enviar los datos al backend */
    const data = await loginUser(email, password)
    console.log(data) // aquí puedes manejar la respuesta del backend, por ejemplo, guardando el token en localStorage
    
    if (data.token) {
        localStorage.setItem("token", data.token)
        window.location.href = "dashboard.html"
    } else {
        alert("Email o contraseña incorrectos")
    }
})