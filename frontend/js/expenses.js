cargarSidebarUsuario();

/* expenses.js - Lógica para la página de gastos */

verificarToken();

const LIMITE_POR_PAGINA = 15;
let todosLosGastos = [];
let paginaActual = 1;
let totalGastos = 0;

async function inicializar(pagina = 1) {
    paginaActual = pagina;
    const resultado = await getExpenses(pagina);
    todosLosGastos = resultado.data;
    totalGastos = resultado.total;

    verificarAlertas(todosLosGastos);
    renderTablaFiltrada(todosLosGastos);
    inicializarFiltros();
    renderPaginacion();
}

function renderPaginacion() {
    const contenedor = document.getElementById('pagination');
    if (!contenedor) return;

    const totalPaginas = Math.ceil(totalGastos / LIMITE_POR_PAGINA);
    if (totalPaginas <= 1) { contenedor.innerHTML = ''; return; }

    let html = '';
    for (let i = 1; i <= totalPaginas; i++) {
        html += `<button class="cg-page-btn ${i === paginaActual ? 'active' : ''}" onclick="inicializar(${i})">${i}</button>`;
    }
    contenedor.innerHTML = html;
}

// Alerta de presupuesto mensual
function verificarAlertas(gastos) {
    const alerta = verificarAlertaPresupuesto(gastos);
    const contenedor = document.getElementById('alert-banner');
    if (!alerta || !contenedor) return;

    if (alerta.superado) {
        contenedor.className = 'cg-alert-banner';
        contenedor.innerHTML = `⚠️ Superaste tu presupuesto mensual: gastaste $${alerta.gastado.toFixed(0)} de $${alerta.presupuesto.toFixed(0)} (${alerta.porcentaje}%)`;
        contenedor.style.display = 'flex';
        mostrarNotificacion('CtrlGasto — Presupuesto superado', `Gastaste $${alerta.gastado.toFixed(0)} de $${alerta.presupuesto.toFixed(0)} este mes.`);
    } else if (alerta.porcentaje >= 80) {
        contenedor.className = 'cg-alert-banner warning';
        contenedor.innerHTML = `🔔 Estás al ${alerta.porcentaje}% de tu presupuesto mensual ($${alerta.gastado.toFixed(0)} de $${alerta.presupuesto.toFixed(0)})`;
        contenedor.style.display = 'flex';
    }
}

// Búsqueda avanzada: filtrar en JS sobre los datos ya cargados
function inicializarFiltros() {
    const inputs = ['#filtro-comercio', '#filtro-categoria', '#filtro-desde', '#filtro-hasta', '#filtro-monto-min', '#filtro-monto-max'];
    inputs.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.addEventListener('input', aplicarFiltros);
    });
}

function aplicarFiltros() {
    const comercio  = document.querySelector('#filtro-comercio')?.value.toLowerCase() || '';
    const categoria = document.querySelector('#filtro-categoria')?.value || '';
    const desde     = document.querySelector('#filtro-desde')?.value;
    const hasta     = document.querySelector('#filtro-hasta')?.value;
    const montoMin  = parseFloat(document.querySelector('#filtro-monto-min')?.value) || 0;
    const montoMax  = parseFloat(document.querySelector('#filtro-monto-max')?.value) || Infinity;

    const filtrados = todosLosGastos.filter(g => {
        const fecha = new Date(g.fecha);
        if (comercio  && !g.comercio.toLowerCase().includes(comercio)) return false;
        if (categoria && g.categoria !== categoria) return false;
        if (desde     && fecha < new Date(desde)) return false;
        if (hasta     && fecha > new Date(hasta)) return false;
        if (Number(g.monto) < montoMin || Number(g.monto) > montoMax) return false;
        return true;
    });

    renderTablaFiltrada(filtrados);
}

// Marcar gastos anómalos en la tabla
function renderTablaFiltrada(gastos) {
    const tbody = document.querySelector('tbody'); // Primero obtenemos el tbody de la tabla de gastos
    if (!tbody) return;
    tbody.innerHTML = '';
    gastos.forEach(g => {
        const anomalo = esGastoAnomalo(g.monto, todosLosGastos);
        tbody.innerHTML += `
            <tr>
                <td>${g.comercio}</td>
                <td>${g.categoria}</td>
                <td>${new Date(g.fecha).toLocaleDateString('es-AR')}</td>
                <td>$${Number(g.monto).toLocaleString('es-AR')}${anomalo ? '<span class="cg-badge-anomalo">⚠️ inusual</span>' : ''}</td>
                <td>
                    <button class="cg-filter" onclick="eliminarGasto(${g.id})">Eliminar</button>
                    <button class="cg-filter" onclick="window.location.href='edit-expense.html?id=${g.id}'">Editar</button>
                </td>
            </tr>`;
    });
}

async function eliminarGasto(id) {
    if (!confirm('¿Seguro que querés eliminar este gasto?')) return;
    try {
        await deleteExpense(id);
        todosLosGastos = todosLosGastos.filter(g => g.id !== id);
        renderTablaFiltrada(todosLosGastos);
    } catch (error) {
        alert('Error al eliminar: ' + error.message);
    }
}

// Exportación a CSV
function exportarCSV() {
    const gastos = todosLosGastos; //"todosLosGastos", variable global que contiene todos los gastos cargados
    if (!gastos.length) { alert('No hay gastos para exportar'); return; }
    const cabecera = ['Comercio', 'Categoría', 'Fecha', 'Monto', 'Descripción'].join(',');
    const filas = gastos.map(g =>
        [`"${g.comercio}"`, `"${g.categoria}"`, new Date(g.fecha).toLocaleDateString('es-AR'), g.monto, `"${g.descripcion || ''}"`].join(',')
    );// g es cada gasto, y se mapea a un array de strings, cada uno representando una fila en el CSV, los dosp 
    const csv = [cabecera, ...filas].join('\n'); //Operador spread para unir la cabecera con las filas, y luego se une todo con saltos de línea
    descargarArchivo(csv, 'gastos.csv', 'text/csv'); 
}

// Exportación a JSON
function exportarJSON() {
    const gastos = todosLosGastos;
    if (!gastos.length) { alert('No hay gastos para exportar'); return; }
    const json = JSON.stringify(gastos, null, 2); //stringify convierte el array de gastos a un string JSON, con indentación de 2 espacios para que sea legible
    descargarArchivo(json, 'gastos.json', 'application/json');
}

// Función para descargar un archivo con el contenido dado, nombre y tipo MIME. 
function descargarArchivo(contenido, nombre, tipo) 
{ 
    const blob = new Blob([contenido], { type: tipo });
    const url  = URL.createObjectURL(blob); 
    const a    = document.createElement('a');
    a.href = url; a.download = nombre; a.click();
    URL.revokeObjectURL(url);
}

inicializar();
