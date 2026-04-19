/* expenses.js - Lógica para la página de visualización de gastos */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()

let allExpenses = []

let filterBtns = document.querySelectorAll(".cg-filter")
filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        filterBtns.forEach(function(b) { b.classList.remove("active") })
        btn.classList.add("active")
        
        const filtro = btn.textContent.trim()
        aplicarFiltro(filtro)
    })
})

function aplicarFiltro(filtro) {
    console.log("allExpenses al filtrar:", allExpenses)
    let datos = [...allExpenses]
    if (filtro === "Por mes") {
        datos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    } else if (filtro === "Categoría") {
        datos.sort((a, b) => a.categoria.localeCompare(b.categoria))
    } else if (filtro === "Comercio") {
        datos.sort((a, b) => a.comercio.localeCompare(b.comercio))
    }
    
    renderTabla(datos)
}

function renderTabla(expenses) {
    const tbody = document.getElementById("expenses-table-body")
    console.log("tbody:", tbody)
    console.log("expenses a renderizar:", expenses)
    tbody.innerHTML = ""
    expenses.forEach(function(expense) {
        tbody.innerHTML += `
            <tr>
                <td>${expense.comercio}</td>
                <td>${expense.categoria}</td>
                <td>${expense.fecha}</td>
                <td>$${expense.monto}</td>
            </tr>
        `
    })
}

async function cargarGastos() {
    allExpenses = await getExpenses()
    renderTabla(allExpenses)
}

cargarGastos()