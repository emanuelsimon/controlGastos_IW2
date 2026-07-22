function verificarToken() {
  let token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/index.html";
  }
}

//Esta función se usa ahora, pero una vez que tengamos el backend funcionando,
// es hacer una verificacion mediante API para asegurarnos que el token es válido y no ha expirado.
// Por ahora, solo verificamos que exista.
function verificarRol(rolRequerido) {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user.rol !== rolRequerido) {
    if (user.rol === "asesor") {
      window.location.href = "/advisor/dashboard.html";
    } else {
      window.location.href = "/dashboard.html";
    }
  }
}

// activarMenu(), mostrarUsuario() y el listener de logout están en components.js,
// que los ejecuta luego de renderizar el sidebar en el DOM.

//La funcion inicializarTabla se llama desde expenses.html y advisor/users.html
// para cargar los datos en la tabla, renderizar las filas y manejar el paginado.
//getData es una función que se encarga de obtener los datos del backend,
// renderFila es una función que recibe un item de datos y devuelve el HTML para esa fila,
// y filtros es un objeto con las funciones para ordenar los datos segun el filtro seleccionado.
function inicializarTabla(getData, renderFila, filtros) {
  const REGISTROS_POR_PAGINA = 15;
  let allData = [];
  let paginaActual = 1;

  async function cargar() {
    allData = await getData();
    paginaActual = 1;
    renderTabla(allData);
  }

  function renderTabla(datos) {
    const tbody = document.querySelector("tbody");
    const pagination = document.getElementById("pagination");

    const totalPaginas = Math.ceil(datos.length / REGISTROS_POR_PAGINA);
    const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA;
    const fin = inicio + REGISTROS_POR_PAGINA;
    const datosPagina = datos.slice(inicio, fin);

    // Renderizar filas
    tbody.innerHTML = "";
    datosPagina.forEach((item) => {
      tbody.innerHTML += renderFila(item);
    });

    // Renderizar paginado
    //El parametro pagination viene de advisor/users.html y expenses.html, es un div
    // donde se van a renderizar los botones de paginado.
    if (pagination) {
      pagination.innerHTML = "";

      if (totalPaginas <= 1) return;

      // Botón anterior
      const btnAnterior = document.createElement("button");
      btnAnterior.textContent = "← Anterior";
      btnAnterior.className = "cg-page-btn";
      btnAnterior.disabled = paginaActual === 1;
      //Funcion para manejar el click en el botón anterior, si no estamos en la primera página,
      // se decrementa la página actual y se vuelve a renderizar la tabla con los datos
      // correspondientes a esa página.
      btnAnterior.addEventListener("click", function () {
        if (paginaActual > 1) {
          paginaActual--;
          renderTabla(datos);
        }
      });
      // El botón anterior se agrega al contenedor de paginación.
      pagination.appendChild(btnAnterior);

      // Botones de páginas
      for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `cg-page-btn ${i === paginaActual ? "active" : ""}`;
        btn.addEventListener("click", function () {
          paginaActual = i;
          renderTabla(datos);
        });
        pagination.appendChild(btn);
      }

      // Botón siguiente
      const btnSiguiente = document.createElement("button");
      btnSiguiente.textContent = "Siguiente →";
      btnSiguiente.className = "cg-page-btn";
      btnSiguiente.disabled = paginaActual === totalPaginas;
      btnSiguiente.addEventListener("click", function () {
        if (paginaActual < totalPaginas) {
          paginaActual++;
          renderTabla(datos);
        }
      });
      pagination.appendChild(btnSiguiente);
    }
  }

  function aplicarFiltro(filtro) {
    let datos = [...allData];
    /**
     * allData = [17 registros originales, sin tocar]
     ↓
    aplicarFiltro("Categoría")
     ↓
    datos = [...allData]  ← copia de los 17, allData sigue intacto
     ↓
    datos.sort(...)  ← ordena la copia
     ↓
    renderTabla(datos)  ← muestra la copia ordenada */
    if (filtros[filtro]) {
      datos = filtros[filtro](datos);
    }
    paginaActual = 1;
    renderTabla(datos);
  }

  document.querySelectorAll(".cg-filter").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".cg-filter")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      aplicarFiltro(btn.textContent.trim());
    });
  });

  cargar();
}


/* =====================================================
   FUNCIONALIDADES EXTRAS
   ===================================================== */

/**
 * Categorización automática por nombre de comercio.
 * Devuelve la categoría más probable o null si no hay match.
 */
function categorizarPorComercio(comercio) {
    if (!comercio) return null;
    const nombre = comercio.toLowerCase();
    const reglas = [
        { categoria: 'Alimentación', palabras: ['carrefour', 'dia', 'coto', 'jumbo', 'disco', 'supermercado', 'almacen', 'verduleria', 'panaderia', 'mercado', 'walmart', 'lidl', 'aldi', 'fravega', 'super'] },
        { categoria: 'Combustible',  palabras: ['ypf', 'shell', 'axion', 'puma', 'nafta', 'combustible', 'estacion', 'petrobras'] },
        { categoria: 'Salud',        palabras: ['farmacia', 'drogueria', 'clinica', 'hospital', 'medico', 'laboratorio', 'optica', 'dentista', 'farmacity', 'ahorro'] },
        { categoria: 'Ocio',         palabras: ['cine', 'teatro', 'spotify', 'netflix', 'disney', 'hbo', 'steam', 'gaming', 'bar', 'restaurante', 'resto', 'delivery', 'rappi', 'pedidosya'] },
        { categoria: 'Transporte',   palabras: ['uber', 'cabify', 'taxi', 'colectivo', 'subte', 'tren', 'peaje', 'parking', 'estacionamiento'] },
        { categoria: 'Educación',    palabras: ['universidad', 'colegio', 'libreria', 'curso', 'udemy', 'coursera', 'academia'] },
        { categoria: 'Hogar',        palabras: ['easy', 'homecenter', 'sodimac', 'ferreteria', 'ikea', 'muebleria', 'electro'] },
        { categoria: 'Ropa',         palabras: ['zara', 'h&m', 'lacoste', 'adidas', 'nike', 'ropa', 'indumentaria', 'calzado', 'zapateria'] },
        { categoria: 'Servicios',    palabras: ['edesur', 'edenor', 'metrogas', 'aysa', 'telecom', 'personal', 'claro', 'movistar', 'fibertel', 'internet', 'cable'] },
    ];
    for (const regla of reglas) {
      // Si alguna palabra de la regla está incluida en el nombre del comercio, se devuelve la categoría correspondiente
        if (regla.palabras.some(p => nombre.includes(p))) { // some() devuelve true si al menos un elemento del array cumple la condición
            return regla.categoria;
        }
    }
    return null;
}

/**
 * Perfil financiero del usuario basado en sus gastos.
 * Devuelve { tipo, descripcion, color } según patrones de consumo.
 */
function calcularPerfilFinanciero(gastos) {
    if (!gastos || gastos.length === 0) {
        return { tipo: 'Sin datos', descripcion: 'Cargá gastos para ver tu perfil financiero.', color: '#64748b' };
    }

    const totales = {};
    let totalGeneral = 0;
    gastos.forEach(g => {
        totales[g.categoria] = (totales[g.categoria] || 0) + Number(g.monto);
        totalGeneral += Number(g.monto);
    });

    const porcentajes = {};
    Object.keys(totales).forEach(k => {
        porcentajes[k] = (totales[k] / totalGeneral) * 100;
    });

    const ocioYEntretenimiento = (porcentajes['Ocio'] || 0);
    const esenciales = (porcentajes['Alimentación'] || 0) + (porcentajes['Salud'] || 0) + (porcentajes['Servicios'] || 0);
    const promedioPorGasto = totalGeneral / gastos.length;

    // Scoring simple
    if (ocioYEntretenimiento > 35) {
        return { tipo: 'Consumidor impulsivo', descripcion: 'Más del 35% de tus gastos son en ocio y entretenimiento.', color: '#e74c3c' };
    }
    if (esenciales > 70) {
        return { tipo: 'Consumidor ahorrador', descripcion: 'La mayor parte de tus gastos son en necesidades esenciales. ¡Excelente hábito!', color: '#2ecc71' };
    }
    return { tipo: 'Consumidor equilibrado', descripcion: 'Tus gastos están bien distribuidos entre distintas categorías.', color: '#f39c12' };
}

/**
 * Detecta si un gasto es anómalo respecto al promedio del usuario.
 * Retorna true si el monto supera 3x el promedio.
 */
function esGastoAnomalo(monto, gastos) {
    if (!gastos || gastos.length < 3) return false; // Necesitamos al menos 3 gastos para calcular un promedio confiable.
    // Calculamos el promedio de los montos de todos los gastos del usuario. Se suman todos los montos y se divide por la cantidad de gastos.
    //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce 
    const promedio = gastos.reduce((sum, g) => sum + Number(g.monto), 0) / gastos.length; 
    return Number(monto) > promedio * 3; // Retorna true si el monto del gasto actual es mayor a 3 veces el promedio, indicando que es un gasto anómalo.
}

/**
 * Verifica si el gasto total del mes actual supera el presupuesto.
 * Devuelve { superado, porcentaje, presupuesto, gastado } o null si no hay presupuesto.
 */
function verificarAlertaPresupuesto(gastos) {
    const presupuesto = parseFloat(localStorage.getItem('cg_presupuesto_mensual'));
    if (!presupuesto) return null;

    const ahora = new Date();
    const gastadoEsteMes = gastos
        .filter(g => {
            const f = new Date(g.fecha);
            return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
        })
        .reduce((sum, g) => sum + Number(g.monto), 0);

    return {
        superado: gastadoEsteMes >= presupuesto,
        porcentaje: Math.round((gastadoEsteMes / presupuesto) * 100),
        presupuesto,
        gastado: gastadoEsteMes
    };
}

/**
 * Muestra una notificación nativa del browser si el usuario la permite.
 */
function mostrarNotificacion(titulo, cuerpo) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
        new Notification(titulo, { body: cuerpo, icon: '' });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permiso => {
            if (permiso === 'granted') new Notification(titulo, { body: cuerpo });
        });
    }
}

/**
 * Punto 11 — Alterna entre modo oscuro (default) y modo claro.
 * Persiste la preferencia en localStorage y actualiza el texto del botón.
 */
function toggleDarkMode() {
    const esModoClaro = document.body.classList.toggle('light-mode');
    localStorage.setItem('cg_light_mode', esModoClaro ? '1' : '0');
    actualizarTextoDarkToggle();
}

function actualizarTextoDarkToggle() {
    const esModoClaro = document.body.classList.contains('light-mode');
    document.querySelectorAll('.cg-dark-toggle').forEach(btn => {
        btn.textContent = esModoClaro ? '🌙 Modo oscuro' : '☀️ Modo claro';
    });
}

function aplicarDarkModeGuardado() {
    if (localStorage.getItem('cg_light_mode') === '1') {
        document.body.classList.add('light-mode');
    }
    // setTimeout 0 para esperar a que el sidebar renderice el botón antes de cambiar su texto
    setTimeout(actualizarTextoDarkToggle, 0);
}

// Aplicar preferencia guardada al cargar cualquier página
aplicarDarkModeGuardado();
