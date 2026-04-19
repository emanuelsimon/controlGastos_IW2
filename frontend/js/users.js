// Verificar que el usuario esté autenticado al cargar la página
verificarToken()
// Verificar que el usuario tenga el rol de asesor
verificarRol("asesor")

inicializarTabla(
    getUsers,
    (user) => `
        <tr>
            <td>${user.dni}</td>
            <td>${user.nombre}</td>
            <td>${user.apellido}</td>
            <td>${user.email}</td>
            <td><button class="cg-filter" onclick="window.location.href='user-detail.html?id=${user.id}'">Ver gastos →</button></td>
        </tr>
    `,
    {
        "Por Apellido": (d) => d.sort((a, b) => a.apellido.localeCompare(b.apellido)),
        "Por Nombre": (d) => d.sort((a, b) => a.nombre.localeCompare(b.nombre))
    }
)
