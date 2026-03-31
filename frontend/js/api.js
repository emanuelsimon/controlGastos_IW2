/** Archivo para manejar las llamadas a la API del backend */

const API_URL = "http://localhost:3000"

//CTRL + K + C para comentar varias líneas de código

/** Función para iniciar sesión */
async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    const data = await response.json()
    return data
}

//Simulacion de respuesta del backend para pruebas 
async function loginUser(email, password) {
    // TEMPORAL: simular respuesta del backend
    return { 
        token: "fake-token-123",
        user: {
            name: "Juan",
            email: email,
            rol: "usuario"
        }
    }
}

async function procesarTicket(base64Image) {
    const response = await fetch(`${API_URL}/tickets/upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ image: base64Image })
    })

    const data = await response.json()
    return data
}