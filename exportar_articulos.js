// exportar_articulos.js
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// URL de conexión
const dbUrl = 'mysql://root:qEcLMSTjhByHvjOWmagSjEYkhRBWcHVP@junction.proxy.rlwy.net:37765/babyconse';

// Parsear la URL para la conexión
const dbConfig = new URL(dbUrl);

const connection = mysql.createConnection({
    host: dbConfig.hostname,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.pathname.replace('/', '')
});

// Carpeta para guardar los archivos Markdown
const outputDir = path.join(__dirname, 'articulos_markdown');

// Crear la carpeta si no existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Consulta SQL para extraer los artículos (solo full_content)
const query = 'SELECT id, full_content FROM articulos';

connection.query(query, (err, results) => {
    if (err) {
        console.error('❌ Error al consultar la base de datos:', err);
        connection.end();
        return;
    }

    results.forEach((row) => {
        const { id, full_content } = row;

        if (!full_content) {
            console.warn(`⚠ El artículo con ID ${id} no tiene contenido en full_content.`);
            return;
        }

        // Ruta del archivo de salida
        const outputPath = path.join(outputDir, `articulo_${id}.md`);

        // Guardar solo el contenido en formato Markdown
        fs.writeFile(outputPath, full_content, (err) => {
            if (err) {
                console.error(`❌ Error al escribir el archivo ${outputPath}:`, err);
                return;
            }
            console.log(`✅ Archivo creado: ${outputPath}`);
        });
    });

    connection.end();
});
