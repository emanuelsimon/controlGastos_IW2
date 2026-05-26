function verificarToken() {
  let token = localStorage.getItem("token");
  if (!token) {
    window.location.href = ROUTES.getPath("index.html");
  }
}

//Esta función se usa ahora, pero una vez que tengamos el backend funcionando,
// es hacer una verificacion mediante API para asegurarnos que el token es válido y no ha expirado.
// Por ahora, solo verificamos que exista.
function verificarRol(rolRequerido) {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user.rol !== rolRequerido) {
    if (user.rol === "asesor") {
      window.location.href = ROUTES.getPath("advisor/dashboard.html");
    } else {
      window.location.href = ROUTES.getPath("dashboard.html");
    }
  }
}

function activarMenu() {
  document.querySelectorAll(".cg-nav-item").forEach((link) => {
    const page = link.getAttribute("href");
    if (window.location.pathname.endsWith(page)) {
      link.classList.add("active");
    }
  });
}

function mostrarUsuario() {
  const user = JSON.parse(localStorage.getItem("user"));
  const el = document.getElementById("user-name");

  if (user && el) {
    el.textContent = user.name;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  activarMenu();
  mostrarUsuario();
});

//Funcion agregada al boton de logout, al hacer click se borra el token y el usuario del localStorage
//redirigiendo al usuario a la página de login (index.html).
document.getElementById("logout-btn").addEventListener("click", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = ROUTES.getPath("index.html");
});

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
