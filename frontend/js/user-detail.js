// Función para verificar los gastos del usuario

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()
// Verificar que el usuario tenga el rol de asesor
verificarRol("asesor")


let params = new URLSearchParams(window.location.search)
let userId = params.get("id")

document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "../index.html"
})

inicializarTabla(
    () => getUserExpenses(userId),
    (expense) => `
        <tr>
            <td>${expense.comercio}</td>
            <td>${expense.categoria}</td>
            <td>${expense.fecha}</td>
            <td>$${expense.monto}</td>
        </tr>
    `,
    {   //Cambiamos el formato "yyyy-mm-dd" a "dd/mm/yyyy" para luego con new Date() poder ordenar 
    // correctamente por fecha y hacer la resta en milisegundos con Date() para ordenar por mes.
    //OJO! Al tener backend funcionando, procurar recibir las fechas en formato ISO 8601(yyyy-mm-dd) 
    // para evitar problemas de parseo.
        "Por mes": (d) => d.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
        //Con localeCompare comparamos alfabeticamente respetando tildes y el idioma español. 
        "Categoría": (d) => d.sort((a, b) => a.categoria.localeCompare(b.categoria)),
        "Comercio": (d) => d.sort((a, b) => a.comercio.localeCompare(b.comercio))
    }
)

