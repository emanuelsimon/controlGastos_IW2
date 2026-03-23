
/**Escuchamos el evento de envío del formulario de login */
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault() // esto evita que la página se recargue
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    /* Llamamos a la función "loginUser" del archivo api.js para enviar los datos al backend */
    /**¿¿Como sabe que tiene que buscar loginUser en el archivo api.js??
     * Respuesta: Porque en el index.html estamos incluyendo ambos archivos js, y el navegador los 
     * carga en el orden que aparecen, entonces cuando el navegador llega a auth.js 
     * ya tiene cargado api.js y puede usar sus funciones
     */
    const data = await loginUser(email, password)
    console.log(data) // aquí puedes manejar la respuesta del backend, por ejemplo, guardando el token en localStorage
    
    if (data.token) {
        localStorage.setItem("token", data.token)
        //Convertimos el objeto javascript a un string JSONpara guardarlo en localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
        window.location.href = "dashboard.html"
    } else {
        alert("Email o contraseña incorrectos")
    }
})