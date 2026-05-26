/**Logica para editar un gasto */

verificarToken()

const params = new URLSearchParams(window.location.search)
if (!params.has("id")) {
    alert("ID de gasto no proporcionado")
    window.location.href = "expenses.html"
}

//Obtenemos el ID del gasto de la URL y luego llamamos a la función getExpenseById para cargar los datos del gasto en el formulario. 
// Si ocurre un error, mostramos un mensaje y redirigimos a la página de gastos.
const expenseId = params.get("id")  

getExpenseById(expenseId).then(expense => {
    document.getElementById("comercio").value = expense.comercio
    document.getElementById("fecha").value = expense.fecha.split("T")[0] // Solo la parte de la fecha, sin la hora
    document.getElementById("monto").value = expense.monto
    document.getElementById("categoria").value = expense.categoria
    document.getElementById("descripcion").value = expense.descripcion
}).catch(error => {
    alert("Error al cargar el gasto: " + error.message)
    window.location.href = "expenses.html"
})

document.getElementById("expense-form").addEventListener("submit", async function (event) {
    event.preventDefault()

    const id = expenseId
    const comercio = document.getElementById("comercio").value
    const fecha = document.getElementById("fecha").value
    const monto = parseFloat(document.getElementById("monto").value.replace(',', '.'))
    const categoria = document.getElementById("categoria").value
    const descripcion = document.getElementById("descripcion").value

    if (!comercio || !fecha || !monto || !categoria) {
        alert("Por favor completá los campos obligatorios")
        return
    }

    try {
        await updateExpense(id, { comercio, fecha, monto, categoria, descripcion })
        alert("Gasto actualizado correctamente")
        window.location.href = "expenses.html"
    } catch (error) {
        alert("Error al actualizar el gasto: " + error.message)
    }
})  