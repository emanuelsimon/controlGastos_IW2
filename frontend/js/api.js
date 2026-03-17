/** Archivo para manejar las llamadas a la API del backend */

const API_URL = "http://localhost:3000"

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