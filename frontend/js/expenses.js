/* expenses.js - Lógica para la página de visualización de gastos */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()


let filterBtns = document.querySelectorAll(".filter-btn")
/*Al cargar la pagina le agrega a cada boton la funcion "addEventListener" y si alguno recibe un click se ejecuta la funcion
    que saca la clase .active de todos los botones y solo la activa en el boton clickeado */
filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        // Sacar .active de todos los botones
        filterBtns.forEach(function(b) {
            b.classList.remove("active")
        })
        // Agregar .active solo al que clickeaste
        btn.classList.add("active")
    })
})


async function cargarGastos() {
    const expenses = await getExpenses()
    const tbody = document.getElementById("expenses-table-body")
    
    tbody.innerHTML = ""
    
    expenses.forEach(function(expense) {
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

cargarGastos()