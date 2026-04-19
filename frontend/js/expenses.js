/* expenses.js - Lógica para la página de visualización de gastos */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()

inicializarTabla(
    getExpenses,
    (expense) => `
        <tr>
            <td>${expense.comercio}</td>
            <td>${expense.categoria}</td>
            <td>${expense.fecha}</td>
            <td>$${expense.monto}</td>
        </tr>
    `,
    {
        "Por mes": (d) => d.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
        "Categoría": (d) => d.sort((a, b) => a.categoria.localeCompare(b.categoria)),
        "Comercio": (d) => d.sort((a, b) => a.comercio.localeCompare(b.comercio))
    }
)