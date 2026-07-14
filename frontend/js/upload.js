cargarSidebarUsuario();

/* upload.js - Subida de tickets con categorización automática y carga múltiple */

verificarToken();

// Punto 13 — Guardar gasto desde el formulario (flujo normal y post-IA)
document.getElementById('expense-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const comercio = document.getElementById('comercio').value;
    const fecha = document.getElementById('fecha').value;
    const monto = parseFloat(document.getElementById('monto').value.replace(',', '.'));
    const categoria = document.getElementById('categoria').value;
    const descripcion = document.getElementById('descripcion').value;

    if (!comercio || !fecha || !monto || !categoria) {
        alert('Por favor completá los campos obligatorios');
        return;
    }

    try {
        await createExpense(comercio, fecha, monto, categoria, descripcion, null);
        alert('Gasto guardado correctamente');
        window.location.href = 'expenses.html';
    } catch (error) {
        alert('Error al guardar el gasto: ' + error.message);
    }
});

// Punto 13 — Procesar ticket con IA y pre-completar formulario
document.getElementById('procesar-btn').addEventListener('click', function () {
    const fileInput = document.getElementById('ticket-image');
    const file = fileInput.files[0];
    if (!file) { alert('Por favor seleccioná una imagen'); return; }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
        const btn = document.getElementById('procesar-btn');
        btn.textContent = '⏳ Procesando...';
        btn.disabled = true;

        try {
            const resultado = await procesarTicket(reader.result);

            if (resultado.comercio) {
                document.getElementById('comercio').value = resultado.comercio;

                // Punto 1 — Categorización automática por comercio
                const categoriaDetectada = categorizarPorComercio(resultado.comercio);
                if (categoriaDetectada && !resultado.categoria) {
                    const select = document.getElementById('categoria');
                    const opcion = Array.from(select.options).find(o => o.value === categoriaDetectada);
                    if (opcion) {
                        select.value = categoriaDetectada;
                        mostrarToast(`Categoría detectada automáticamente: ${categoriaDetectada}`);
                    }
                }
            }
            if (resultado.monto) document.getElementById('monto').value = resultado.monto;
            if (resultado.fecha) document.getElementById('fecha').value = resultado.fecha;
            if (resultado.categoria) {
                const select = document.getElementById('categoria');
                const opcion = Array.from(select.options).find(o => o.value === resultado.categoria);
                if (opcion) select.value = resultado.categoria;
            }

            // Punto 13 — Mostrar mensaje de revisión
            mostrarToast('✅ Revisá y corregí los datos antes de guardar');

        } catch (error) {
            alert('Error al procesar el ticket: ' + error.message);
        } finally {
            btn.textContent = '✨ Procesar con IA';
            btn.disabled = false;
        }
    };
});

// Punto 1 — Categorizar automáticamente cuando el usuario escribe el comercio a mano
document.getElementById('comercio').addEventListener('blur', function () {
    const select = document.getElementById('categoria');
    if (select.value) return; // ya tiene categoría seleccionada, no pisar
    const cat = categorizarPorComercio(this.value);
    if (cat) {
        const opcion = Array.from(select.options).find(o => o.value === cat);
        if (opcion) {
            select.value = cat;
            mostrarToast(`Categoría sugerida automáticamente: ${cat}`);
        }
    }
});

// Dropzone — imagen única
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('ticket-image');
const preview = document.getElementById('preview-img');

dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => mostrarPreview(fileInput.files[0]));
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', e => {
    e.preventDefault(); dropzone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) mostrarPreview(e.dataTransfer.files[0]);
});

function mostrarPreview(file) {
    const reader = new FileReader();
    reader.onload = () => { preview.src = reader.result; preview.style.display = 'block'; };
    reader.readAsDataURL(file);
}

// Carga múltiple de tickets
const multiInput = document.getElementById('multi-ticket-input');
if (multiInput) {
    multiInput.addEventListener('change', async function () {
        const archivos = Array.from(this.files);
        if (!archivos.length) return;

        const cola = document.getElementById('multi-queue');
        cola.innerHTML = '';

        for (const archivo of archivos) {
            const item = document.createElement('div');
            item.className = 'cg-queue-item';
            item.innerHTML = `<span>${archivo.name}</span><span class="cg-queue-status wait">⏳ Esperando...</span>`;
            cola.appendChild(item);
        }

        const items = cola.querySelectorAll('.cg-queue-item');
        for (let i = 0; i < archivos.length; i++) {
            const statusEl = items[i].querySelector('.cg-queue-status');
            statusEl.textContent = '⏳ Procesando...';
            statusEl.className = 'cg-queue-status wait';

            try {
                const base64 = await leerComoBase64(archivos[i]);
                const resultado = await procesarTicket(base64);

                // Guardar automáticamente con los datos detectados
                if (resultado.monto && resultado.comercio) {
                    const cat = resultado.categoria || categorizarPorComercio(resultado.comercio) || 'Otro';
                    await createExpense(
                        resultado.comercio,
                        resultado.fecha || new Date().toISOString().split('T')[0],
                        parseFloat(resultado.monto),
                        cat,
                        `Carga múltiple: ${archivos[i].name}`,
                        null
                    );
                    statusEl.textContent = '✅ Guardado';
                    statusEl.className = 'cg-queue-status ok';
                } else {
                    statusEl.textContent = '⚠️ Sin datos suficientes';
                    statusEl.className = 'cg-queue-status error';
                }
            } catch {
                statusEl.textContent = '❌ Error';
                statusEl.className = 'cg-queue-status error';
            }
        }
    });
}

function leerComoBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Toast simple para mensajes no intrusivos
function mostrarToast(msg) {
    let toast = document.getElementById('cg-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cg-toast';
        toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1a2236;border:0.5px solid #2563eb;color:#93c5fd;padding:10px 18px;border-radius:10px;font-size:13px;z-index:9999;transition:opacity 0.3s';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}
