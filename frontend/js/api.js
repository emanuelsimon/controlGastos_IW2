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
