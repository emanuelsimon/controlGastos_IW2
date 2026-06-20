cargarSidebarUsuario();

/* reports.js - Lógica de reportes */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken();

async function cargarReportes() {
  const data = await getReportsData();

  new Chart(document.getElementById("grafico-categorias"), {
    type: "pie",
    data: {
      labels: data.categorias.labels,
      datasets: [
        {
          data: data.categorias.datos,
          backgroundColor: ["#447799", "#e74c3c", "#2ecc71", "#f39c12"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#94a3b8",
            font: {
              family: "DM Sans",
              size: 11,
            },
          },
        },
      },
    },
  });

  new Chart(document.getElementById("grafico-meses"), {
    type: "bar",
    data: {
      labels: data.meses.labels,
      datasets: [
        {
          label: "Gastos por mes",
          data: data.meses.datos,
          backgroundColor: "#447799",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#94a3b8",
            font: {
              family: "DM Sans",
              size: 11,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b" },
          grid: { color: "#1e293b" },
        },
        y: {
          ticks: { color: "#64748b" },
          grid: { color: "#1e293b" },
        },
      },
    },
  });

  new Chart(document.getElementById("grafico-comercios"), {
    type: "bar",
    data: {
      labels: data.comercios.labels,
      datasets: [
        {
          label: "Monto total",
          data: data.comercios.datos,
          backgroundColor: "#2ecc71",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#94a3b8",
            font: {
              family: "DM Sans",
              size: 11,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b" },
          grid: { color: "#1e293b" },
        },
        y: {
          ticks: { color: "#64748b" },
          grid: { color: "#1e293b" },
        },
      },
    },
  });
}

cargarReportes();
