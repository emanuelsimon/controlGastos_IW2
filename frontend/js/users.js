// Verificar que el usuario esté autenticado al cargar la página
verificarToken()
// Verificar que el usuario tenga el rol de asesor
verificarRol("asesor")

// Inicializar la tabla de usuarios, pasando la función para obtener los datos.
inicializarTabla(
    getUsers,
    (user) => `
    <tr>
        <td>${user.dni}</td>
        <td>${user.nombre}</td>
        <td>${user.apellido}</td>
        <td>${user.email}</td>
        <td>
            <button class="cg-filter" onclick="event.stopPropagation(); window.location.href=ROUTES.getPath('user-detail.html?id=${user.id}')">Ver gastos →</button>
            <button class="cg-filter" onclick="event.stopPropagation(); window.location.href=ROUTES.getPath('send-recommendation.html?userId=${user.id}&nombre=${encodeURIComponent(user.nombre + ' ' + user.apellido)}')">💡 Recomendar</button>
        </td>
    </tr>
`,
    //Cada filtro es una función que recibe el array de datos y lo ordena según el criterio seleccionado.
    {
        "Por Apellido": (d) => d.sort((a, b) => a.apellido.localeCompare(b.apellido)),
        "Por Nombre": (d) => d.sort((a, b) => a.nombre.localeCompare(b.nombre))
    }
)
