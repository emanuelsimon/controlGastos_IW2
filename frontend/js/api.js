/** Archivo para manejar las llamadas a la API del backend */

const API_URL = "http://localhost:3000";

//CTRL + K + C para comentar varias líneas de código

/** Función para iniciar sesión */
async function loginUser(email, password) {
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


//El fetch a la ruta /expenses del backend devuelve un objeto 
// con una propiedad "data" que contiene el array de gastos.
async function getExpenses(page = 1) {
    const user = JSON.parse(localStorage.getItem("user"))
    const response = await fetch(`${API_URL}/expenses?userId=${user.id}&page=${page}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    const data = await response.json()
    return data.data
}


async function getUsers(page = 1) {
    const response = await fetch(`${API_URL}/users?page=${page}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    const data = await response.json()
    return data.data
}

async function getUserById(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    return response.json()
}


//Obtenemos los gastos del usuario logueado, pasando el userId como parámetro en la URL.
async function getUserExpenses(userId, page = 1) {
    const response = await fetch(`${API_URL}/expenses?userId=${userId}&page=${page}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    const data = await response.json()
    return data.data
}


async function getReportsData() {
    const user = JSON.parse(localStorage.getItem("user"))
    const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` }

    const [categorias, meses, comercios] = await Promise.all([
        fetch(`${API_URL}/expenses/reportes/categorias?userId=${user.id}`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/expenses/reportes/meses?userId=${user.id}`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/expenses/reportes/comercios?userId=${user.id}`, { headers }).then(r => r.json()),
    ])

    return { categorias, meses, comercios }
}

//Función para crear un nuevo gasto, enviando los datos al backend a través de una solicitud POST a la ruta /expenses.
async function createExpense(comercio, fecha, monto, categoria, descripcion, imagen) {
    const user = JSON.parse(localStorage.getItem("user"))
    const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ //Convertimos el objeto JavaScript en una cadena JSON para enviarla al backend. 
            comercio,
            fecha,
            monto: parseFloat(monto),
            categoria,
            descripcion,
            imagen,
            userId: user.id
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }

    return response.json()
}

async function deleteExpense(id) {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }
    return response.json()
}