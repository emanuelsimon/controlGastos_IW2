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
        { id: 4, comercio: "Restaurante El Faro", categoria: "Ocio", fecha: "2026-03-18", monto: 5000 },
        { id: 5, comercio: "Cine", categoria: "Ocio", fecha: "2026-03-19", monto: 2800 },
        { id: 6, comercio: "Librería", categoria: "Educación", fecha: "2026-03-20", monto: 1500 },
        { id: 7, comercio: "Gimnasio", categoria: "Salud", fecha: "2026-03-21", monto: 4000 },
        { id: 8, comercio: "Uber", categoria: "Transporte", fecha: "2026-03-22", monto: 900 },
        { id: 9, comercio: "Netflix", categoria: "Ocio", fecha: "2026-03-23", monto: 1800 },
        { id: 10, comercio: "Supermercado Coto", categoria: "Alimentación", fecha: "2026-03-24", monto: 12000 },
        { id: 11, comercio: "Rappi", categoria: "Alimentación", fecha: "2026-03-25", monto: 3200 },
        { id: 12, comercio: "Shell", categoria: "Combustible", fecha: "2026-03-26", monto: 65000 },
        { id: 13, comercio: "Farmacity", categoria: "Salud", fecha: "2026-03-27", monto: 2100 },
        { id: 14, comercio: "McDonald's", categoria: "Alimentación", fecha: "2026-03-28", monto: 4500 },
        { id: 15, comercio: "Spotify", categoria: "Ocio", fecha: "2026-03-29", monto: 800 },
        { id: 16, comercio: "Carrefour", categoria: "Alimentación", fecha: "2026-03-30", monto: 9800 },
        { id: 17, comercio: "BP", categoria: "Combustible", fecha: "2026-03-31", monto: 70000 },
    ]
}

// Simular obtener usuarios (para el asesor)
async function getUsers() {
    return [
        { id: 1, nombre: "Juan", apellido: "Pérez", dni: "12345678", email: "juan@test.com" },
        { id: 2, nombre: "María", apellido: "Gómez", dni: "87654321", email: "maria@test.com" },
        { id: 3, nombre: "Carlos", apellido: "López", dni: "11223344", email: "carlos@test.com" },
        { id: 4, nombre: "Ana", apellido: "Martínez", dni: "44332211", email: "ana@test.com" },
        { id: 5, nombre: "Luis", apellido: "García", dni: "55667788", email: "luis@test.com" },
        { id: 6, nombre: "Laura", apellido: "Fernández", dni: "88776655", email: "laura@test.com" },
        { id: 7, nombre: "Diego", apellido: "Rodríguez", dni: "99887766", email: "diego@test.com" },
        { id: 8, nombre: "Sofía", apellido: "Sánchez", dni: "66778899", email: "sofia@test.com" },
        { id: 9, nombre: "Matías", apellido: "Torres", dni: "33445566", email: "matias@test.com" },
        { id: 10, nombre: "Valentina", apellido: "Ruiz", dni: "22334455", email: "valentina@test.com" },
        { id: 11, nombre: "Federico", apellido: "Díaz", dni: "77665544", email: "federico@test.com" },
        { id: 12, nombre: "Camila", apellido: "Morales", dni: "44556677", email: "camila@test.com" },
        { id: 13, nombre: "Sebastián", apellido: "Jiménez", dni: "55443322", email: "sebastian@test.com" },
        { id: 14, nombre: "Florencia", apellido: "Herrera", dni: "33221144", email: "florencia@test.com" },
        { id: 15, nombre: "Gonzalo", apellido: "Castro", dni: "22113344", email: "gonzalo@test.com" },
        { id: 16, nombre: "Lucía", apellido: "Vargas", dni: "11334422", email: "lucia@test.com" },
        { id: 17, nombre: "Nicolás", apellido: "Romero", dni: "44221133", email: "nicolas@test.com" },
    ]
}

async function getUserById(id) {
    const users = await getUsers()
    return users.find(u => u.id === parseInt(id))
}

// Simular obtener gastos de un usuario específico (para el asesor)
async function getUserExpenses(userId) {
    return [
        { id: 1, comercio: "Supermercado Día", categoria: "Alimentación", fecha: "2026-03-15", monto: 2500 },
        { id: 2, comercio: "Restaurante El Faro", categoria: "Ocio", fecha: "2026-02-18", monto: 5000 },
        { id: 3, comercio: "Gasolinera Shell", categoria: "Transporte", fecha: "2026-01-10", monto: 4500 },
        { id: 4, comercio: "Farmacia Central", categoria: "Salud", fecha: "2026-03-02", monto: 1200 },
        { id: 5, comercio: "Netflix", categoria: "Suscripciones", fecha: "2026-02-05", monto: 800 },
        { id: 6, comercio: "Coto", categoria: "Alimentación", fecha: "2026-01-22", monto: 3200 },
        { id: 7, comercio: "Gimnasio Fit", categoria: "Salud", fecha: "2026-02-01", monto: 2100 },
        { id: 8, comercio: "Starbucks", categoria: "Ocio", fecha: "2026-03-12", monto: 950 },
        { id: 9, comercio: "Amazon", categoria: "Hogar", fecha: "2026-01-15", monto: 6700 },
        { id: 10, comercio: "Uber", categoria: "Transporte", fecha: "2026-02-27", monto: 1100 },
        { id: 11, comercio: "Apple Music", categoria: "Suscripciones", fecha: "2026-03-01", monto: 600 },
        { id: 12, comercio: "Carrefour", categoria: "Alimentación", fecha: "2026-02-14", monto: 4100 },
        { id: 13, comercio: "Cine Hoyts", categoria: "Ocio", fecha: "2026-01-05", monto: 1800 },
        { id: 14, comercio: "Veterinaria", categoria: "Mascotas", fecha: "2026-03-20", monto: 3500 },
        { id: 15, comercio: "Pago Mis Cuentas (Luz)", categoria: "Servicios", fecha: "2026-02-10", monto: 5200 },
        { id: 16, comercio: "Zara", categoria: "Ropa", fecha: "2026-01-30", monto: 8900 },
        { id: 17, comercio: "Librería Yenny", categoria: "Cultura", fecha: "2026-03-05", monto: 2300 },
        { id: 18, comercio: "Mc Donalds", categoria: "Ocio", fecha: "2026-02-22", monto: 1500 },
        { id: 19, comercio: "Subte/Bus", categoria: "Transporte", fecha: "2026-01-12", monto: 400 },
        { id: 20, comercio: "Easy", categoria: "Hogar", fecha: "2026-03-18", monto: 12400 },
    ]
}


async function getReportsData() {
    return {
        categorias: {
            labels: ["Alimentación", "Combustible", "Salud", "Ocio", "Transporte", "Suscripciones", "Hogar", "Mascotas", "Servicios", "Ropa", "Cultura"],
            datos: [45000, 78000, 3500, 5000]
        },
        meses: {
            labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
            datos: [50000, 95000, 131500]
        },
        comercios: {
            labels: ["YPF", "Supermercado Día", "Farmacia", "Restaurante El Faro"],
            datos: [78000, 45000, 3500, 5000]
        }
    }
}