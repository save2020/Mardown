require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: 'junction.proxy.rlwy.net',
    user: 'root',
    password: 'qEcLMSTjhByHvjOWmagSjEYkhRBWcHVP',
    database: 'babyconse',
    port: 37765
};

// Ruta de la carpeta con los archivos modificados
const folderPath = path.join(__dirname, 'articulos_markdown');

// Función para actualizar todos los artículos
async function updateAllArticles() {
    const connection = await mysql.createConnection(dbConfig);
    let updatedCount = 0;

    try {
        const files = fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.md'))
            .sort((a, b) => {
                const idA = parseInt(a.match(/articulo_(\d+)\.md/)?.[1] || 0, 10);
                const idB = parseInt(b.match(/articulo_(\d+)\.md/)?.[1] || 0, 10);
                return idA - idB;
            });

        for (const file of files) {
            const match = file.match(/articulo_(\d+)\.md/);
            if (!match) {
                console.warn(`Nombre de archivo no válido: ${file}`);
                continue;
            }

            const id = parseInt(match[1], 10);
            const filePath = path.join(folderPath, file);
            const content = fs.readFileSync(filePath, 'utf8').trim();

            if (!content) {
                console.warn(`El archivo ${file} está vacío. Saltando.`);
                continue;
            }

            console.log(`🔄 Actualizando artículo ID: ${id} desde archivo: ${file}`);

            const [result] = await connection.execute(
                'UPDATE articulos SET full_content = ? WHERE id = ?',
                [content, id]
            );

            if (result.affectedRows > 0) {
                console.log(`✅ Artículo con ID ${id} actualizado correctamente.`);
                updatedCount++;
            } else {
                console.warn(`⚠️ No se encontró un artículo con ID ${id}.`);
            }
        }

        console.log(`🎉 Proceso completado. Total de artículos actualizados: ${updatedCount}`);
    } catch (error) {
        console.error('❌ Error durante la actualización:', error);
    } finally {
        await connection.end();
    }
}

updateAllArticles();
