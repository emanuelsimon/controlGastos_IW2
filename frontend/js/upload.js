/* upload.js - Lógica para la subida de archivos */

// Verificar que el usuario esté autenticado al cargar la página
verificarToken()

document.getElementById("inicio-btn").addEventListener("click", function () {
  window.location.href = "dashboard.html";
});

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
