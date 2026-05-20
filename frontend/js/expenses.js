/* expenses.js - Lógica para la página de visualización de gastos */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()

inicializarTabla(
    getExpenses,
    (expense) => `
        <tr>
            <td>${expense.comercio}</td>
            <td>${expense.categoria}</td>
            <td>${new Date(expense.fecha).toLocaleDateString('es-AR')}</td>
            <td>$${expense.monto}</td>
            <td>
                <button class="cg-filter" onclick="eliminarGasto(${expense.id})">Eliminar</button>
                <button class="cg-filter" onclick="window.location.href='edit-expense.html?id=${expense.id}'">Editar</button>
            </td>
        </tr>
    `,
    {
        "Por mes": (d) => d.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
        "Categoría": (d) => d.sort((a, b) => a.categoria.localeCompare(b.categoria)),
        "Comercio": (d) => d.sort((a, b) => a.comercio.localeCompare(b.comercio))
    }
)

async function eliminarGasto(id) {
    if (!confirm("¿Seguro que querés eliminar este gasto?")) return
    
    try {
        await deleteExpense(id)
        location.reload()
    } catch (error) {
        alert("Error al eliminar: " + error.message)
    }
}