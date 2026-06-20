cargarSidebarAsesor();

// Función para verificar los gastos del usuario

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()
// Verificar que el usuario tenga el rol de asesor
verificarRol("asesor")

// 1. Primero obtenemos el id de la URL
let params = new URLSearchParams(window.location.search)
let userId = params.get("id")

// 2. Con ese id buscamos el usuario y mostramos su nombre en el encabezado de la página.
async function mostrarNombreUsuario() {
    const user = await getUserById(userId)
    if (user) {
    }
}
mostrarNombreUsuario()

// 3. Inicializamos la tabla con los gastos de ese usuario, usando la función getUserExpenses(userId) 
// que simula obtener los gastos de un usuario específico.
inicializarTabla(
    () => getUserExpenses(userId),
    (expense) => `
        <tr>
            <td>${expense.comercio}</td>
            <td>${expense.categoria}</td>
            <td>${new Date(expense.fecha).toLocaleDateString('es-AR')}</td>
            <td>$${expense.monto}</td>
        </tr>
    `,
    {   
    //Cambiamos el formato "yyyy-mm-dd" a "dd/mm/yyyy" para luego con new Date() poder ordenar 
    // correctamente por fecha y hacer la resta en milisegundos con Date() para ordenar por mes.
    //OJO! Al tener backend funcionando, procurar recibir las fechas en formato ISO 8601(yyyy-mm-dd) 
    // para evitar problemas de parseo.
        "Por mes": (d) => d.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
        //Con localeCompare comparamos alfabeticamente respetando tildes y el idioma español. 
        "Categoría": (d) => d.sort((a, b) => a.categoria.localeCompare(b.categoria)),
        "Comercio": (d) => d.sort((a, b) => a.comercio.localeCompare(b.comercio))
    }
)

