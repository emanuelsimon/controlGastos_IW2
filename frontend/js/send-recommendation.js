cargarSidebarAsesor();

verificarToken()
verificarRol("asesor")

const params = new URLSearchParams(window.location.search)
const usuarioId = params.get("userId")
const usuarioNombre = params.get("nombre")

document.getElementById("user-target").textContent = usuarioNombre || `Usuario #${usuarioId}`

// Cargar historial al inicio
cargarHistorial()

async function cargarHistorial() {
    const contenedor = document.getElementById("historial-recomendaciones")
    try {
        const recs = await getRecommendationsByUser(usuarioId)

        if (!recs || recs.length === 0) {
            contenedor.innerHTML = '<p class="cg-loading">Todavía no hay recomendaciones para este usuario.</p>'
            return
        }

        // Ordenar por fecha descendente
        recs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

        contenedor.innerHTML = recs.map(r => {
            const fecha = r.fecha.split('T')[0].split('-').reverse().join('/') // Formatear fecha
            return `
                <div style="padding: 12px 0; border-bottom: 0.5px solid var(--border-light);">
                    <p style="font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">${r.mensaje}</p>
                    <p style="font-size: 12px; color: var(--text-muted);">${fecha}</p>
                </div>`
        }).join('')

    } catch (error) {
        contenedor.innerHTML = '<p class="cg-loading">Error al cargar el historial.</p>'
    }
}

document.getElementById("recommendation-form").addEventListener("submit", async function(e) {
    e.preventDefault()
    const mensaje = document.getElementById("mensaje").value
    if (!mensaje.trim()) {
        alert("Escribí una recomendación")
        return
    }
    try {
        await sendRecommendation(mensaje, usuarioId)
        document.getElementById("mensaje").value = ""
        cargarHistorial() // refrescar historial sin redirigir
    } catch (error) {
        alert("Error: " + error.message)
    }
})
