/** Archivo para manejar las llamadas a la API del backend */

const API_URL = "http://localhost:3000";

//CTRL + K + C para comentar varias líneas de código

/** Función para iniciar sesión */
/*async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return await response.json();
}*/


async function loginUser(email, password) {
    const users = [
        {
            token: "fake-token-usuario",
            user: {
                name: "Juan Usuario",
                email: "user@mail.com",
                rol: "usuario",
                password: "user"
            }
        },
        {
            token: "fake-token-asesor",
            user: {
                name: "María Asesora",
                email: "asesor@mail.com",
                rol: "asesor",
                password: "asesor"
            }
        }
    ]
    //Recorremos con "u" el array de usuarios un usuario buscando por el email ingresado en el formulario de login. 
    // Si encuentra un usuario con ese email, lo devuelve. 
    // Si no lo encuentra, devuelve undefined.
    const found = users.find(u => u.user.email === email)

    if (!found) {
        throw new Error("Credenciales incorrectas")
    }

    return found
}

async function registerUser(nombre, apellido, dni, email, password, rol) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, apellido, dni, email, password, rol })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    return response.json()
}


async function procesarTicket(base64Image) {
  const response = await fetch(`${API_URL}/tickets/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ image: base64Image }),
  });

  const data = await response.json();
  return data;
}


// Simular obtener gastos del usuario logueado
async function getExpenses() {
    return [
        { id: 1, comercio: "Supermercado Día", categoria: "Alimentación", fecha: "2026-06-15", monto: 2500 },
        { id: 2, comercio: "Estacion YPF", categoria: "Combustible", fecha: "2026-03-16", monto: 78000 },
        { id: 3, comercio: "Farmacia", categoria: "Salud", fecha: "2026-02-17", monto: 3500 },
    ]
}

// Simular obtener usuarios (para el asesor)
async function getUsers() {
    return [
        { id: 1, nombre: "Juan", apellido: "Pérez", dni: "12345678", email: "juan@test.com" },
        { id: 2, nombre: "María", apellido: "Gómez", dni: "87654321", email: "maria@test.com" },
    ]
}

// Simular obtener gastos de un usuario específico (para el asesor)
async function getUserExpenses(userId) {
    return [
        { id: 1, comercio: "Supermercado Día", categoria: "Alimentación", fecha: "2026-03-15", monto: 2500 },
        { id: 2, comercio: "Restaurante", categoria: "Ocio", fecha: "2026-02-18", monto: 5000 },
    ]
}


async function getReportsData() {
    return {
        categorias: {
            labels: ["Alimentación", "Combustible", "Salud", "Ocio"],
            datos: [45000, 78000, 3500, 5000]
        },
        meses: {
            labels: ["Enero", "Febrero", "Marzo"],
            datos: [50000, 95000, 131500]
        },
        comercios: {
            labels: ["YPF", "Supermercado Día", "Farmacia", "Restaurante"],
            datos: [78000, 45000, 3500, 5000]
        }
    }
}