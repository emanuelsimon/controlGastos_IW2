/* upload.js - Lógica para la subida de archivos */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()

//Obtenemos y validamos que los campos estén completos y se llama a la función createExpense para guardar el gasto. 
document.getElementById("expense-form").addEventListener("submit", async function (event) { //expense-form es el id del formulario en upload.html
    event.preventDefault()

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
        await createExpense(comercio, fecha, monto, categoria, descripcion, null)
        alert("Gasto guardado correctamente")
        window.location.href = "expenses.html"//redirige a la página de gastos después de guardar el nuevo gasto
    } catch (error) {
        alert("Error al guardar el gasto: " + error.message)
    }
})




document.getElementById("procesar-btn").addEventListener("click", function () {
    let fileInput = document.getElementById("ticket-image");
    let file = fileInput.files[0]; // Obtiene la el archivo seleccionado

    if (!file) {
        // Controlamos que el usuario haya seleccionado un archivo luego de apretar el botón
        alert("Por favor seleccioná una imagen");
        return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file); // empieza a leer el archivo y cuando termina,
    // se ejecutará el evento "onload" que definimos abajo. El resultado será la imagen en base64.

    reader.onload = async function () {
        let base64 = reader.result

        // Mostrar estado de carga
        const btn = document.getElementById("procesar-btn")
        btn.textContent = "⏳ Procesando..."
        btn.disabled = true

        try {
            const resultado = await procesarTicket(base64)

            if (resultado.comercio) document.getElementById("comercio").value = resultado.comercio
            if (resultado.monto) document.getElementById("monto").value = resultado.monto
            if (resultado.fecha) document.getElementById("fecha").value = resultado.fecha
            if (resultado.categoria) {
                const select = document.getElementById("categoria")
                const opcion = Array.from(select.options).find(o => o.value === resultado.categoria)
                if (opcion) {
                    select.value = resultado.categoria
                }
            }

        } catch (error) {
            alert("Error al procesar el ticket: " + error.message)
        } finally {
            // Restaurar botón siempre, haya error o no
            btn.textContent = "✨ Procesar con IA"
            btn.disabled = false
        }
    };
});

const dropzone = document.getElementById("dropzone")
const fileInput = document.getElementById("ticket-image")
const preview = document.getElementById("preview-img")

// Click para abrir el selector de archivos
dropzone.addEventListener("click", function () {
    fileInput.click()
})

// Cuando se selecciona un archivo
fileInput.addEventListener("change", function () {
    mostrarPreview(fileInput.files[0])
})

// Drag over
dropzone.addEventListener("dragover", function (e) {
    e.preventDefault()
    dropzone.classList.add("dragover")
})

dropzone.addEventListener("dragleave", function () {
    dropzone.classList.remove("dragover")
})

// Drop
dropzone.addEventListener("drop", function (e) {
    e.preventDefault()
    dropzone.classList.remove("dragover")
    const file = e.dataTransfer.files[0]
    if (file) mostrarPreview(file)
})

function mostrarPreview(file) {
    const reader = new FileReader()
    reader.onload = function () {
        preview.src = reader.result
        preview.style.display = "block"
    }
    reader.readAsDataURL(file)
}