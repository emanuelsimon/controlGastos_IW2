/**
 * build.js
 *
 * Ejecutado por Vercel antes del deploy.
 *
 * Lee la variable de entorno API_URL y genera el archivo
 * js/config.js con la URL del backend de producción.
 *
 * En desarrollo local, el archivo js/config.js del repositorio
 * apunta a http://localhost:3000.
 */

const fs = require("fs");
const path = require("path");

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  console.error(
    "ERROR: La variable de entorno API_URL no está definida en Vercel.\n" +
    "Definila en: Settings → Environment Variables → API_URL\n" +
    "Valor esperado: https://controlgastos-iw2.onrender.com"
  );
  process.exit(1);
}

const configPath = path.join(__dirname, "js", "config.js");

const contenido = `/**
 * config.js — generado automáticamente por build.js
 * No editar manualmente. El valor de API_URL viene de la
 * variable de entorno definida en el panel de Vercel.
 */

const API_URL = "${apiUrl}";
`;

fs.writeFileSync(configPath, contenido, "utf8");
console.log(`config.js generado con API_URL = ${apiUrl}`);
