// Función para verificar los gastos del usuario

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()
// Verificar que el usuario tenga el rol de asesor
verificarRol("asesor")


let params = new URLSearchParams(window.location.search)
let userId = params.get("id")
console.log(userId) // Verficamos que el ID se esté obteniendo correctamente

//Harcodeamos el nombre del usuario por ahora, luego lo reemplazaremos por 
// el nombre real obtenido de la API
document.getElementById("user-name").textContent = "Juan Pérez"

async function cargarDetalleUsuarios() {
    const expenses = await getUserExpenses(userId)
    const tbody = document.getElementById("expenses-table-body")
    
    tbody.innerHTML = ""
    
    users.forEach(function(user) {
        const fila = `
            <tr>
                <td>${expense.comercio}</td>
                <td>${expense.categoria}</td>
                <td>${expense.fecha}</td>
                <td>$${expense.monto}</td>
            </tr>
        `
        tbody.innerHTML += fila
    })
}
cargarDetalleUsuarios()

