// Verificar que el usuario esté autenticado al cargar la página
verificarToken()
// Verificar que el usuario tenga el rol de asesor
verificarRol("asesor")

// Agrego el Listener para volver al inicio
document.getElementById("inicio-btn").addEventListener("click", function() {
    window.location.href = "../dashboard.html"
})


async function cargarUsuarios() {
    const users = await getUsers()
    const tbody = document.getElementById("expenses-table-body")
    
    tbody.innerHTML = ""
    
    users.forEach(function(user) {
        const fila = `
            <tr>
                <td>${user.dni}</td>
                <td>${user.nombre}</td>
                <td>${user.apellido}</td>
                <td>${user.email}</td>
                <td><button onclick="window.location.href='user-detail.html?id=${user.id}'">Ver gastos</button></td>
            </tr>
        `
        tbody.innerHTML += fila
    })
}
cargarUsuarios()

