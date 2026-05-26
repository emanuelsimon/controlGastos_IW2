/** Configuración de rutas según el entorno (local o producción) */

const ROUTES = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    getPath: function(filename) {
        // En LOCAL: añade "frontend/" al inicio
        // En PRODUCCIÓN: usa la ruta directa
        return this.isDevelopment ? `frontend/${filename}` : filename
    }
}
