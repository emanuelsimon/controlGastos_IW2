/* upload.js - Lógica para la subida de archivos */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()

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
    let base64 = reader.result; // acá está la imagen en base64
    
    let data = await procesarTicket(base64)
    console.log(data)
  };
});

const dropzone = document.getElementById("dropzone")
const fileInput = document.getElementById("ticket-image")
const preview = document.getElementById("preview-img")

// Click para abrir el selector de archivos
dropzone.addEventListener("click", function() {
    fileInput.click()
})

// Cuando se selecciona un archivo
fileInput.addEventListener("change", function() {
    mostrarPreview(fileInput.files[0])
})

// Drag over
dropzone.addEventListener("dragover", function(e) {
    e.preventDefault()
    dropzone.classList.add("dragover")
})

dropzone.addEventListener("dragleave", function() {
    dropzone.classList.remove("dragover")
})

// Drop
dropzone.addEventListener("drop", function(e) {
    e.preventDefault()
    dropzone.classList.remove("dragover")
    const file = e.dataTransfer.files[0]
    if (file) mostrarPreview(file)
})

function mostrarPreview(file) {
    const reader = new FileReader()
    reader.onload = function() {
        preview.src = reader.result
        preview.style.display = "block"
    }
    reader.readAsDataURL(file)
}