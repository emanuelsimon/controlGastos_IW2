verificarToken()
verificarRol("usuario")

document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "index.html"    
})

async function cargarRecomendaciones() {
    const lista = document.getElementById("recommendations-list")
    const data = await getRecommendations()
    
    if (data.length === 0) {
        lista.innerHTML = '<p style="color:#64748b">No tenés recomendaciones todavía.</p>'
        return
    }

    lista.innerHTML = data.map(r => `
        <div style="border-bottom:0.5px solid #2e3a52; padding:1rem 0;">
            <p style="color:#f1f5f9; font-size:15px">${r.mensaje}</p>
            <p style="color:#64748b; font-size:12px; margin-top:0.5rem">
                💼 ${r.asesor.nombre} ${r.asesor.apellido} — ${new Date(r.fecha).toLocaleDateString('es-AR')}
            </p>
        </div>
    `).join('')
}

cargarRecomendaciones()