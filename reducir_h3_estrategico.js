const fs = require('fs');
const path = require('path');

// Directorios de entrada y salida
const inputDir = './articulos_markdown';
const outputDir = './articulos_modificados';

// Crear directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Palabras clave para identificar subtemas importantes
const keywords = ['beneficios', 'riesgos', 'consejos', 'ventajas', 'desventajas', 'cómo', 'pasos', 'importancia', 'consideraciones'];

// Límite de H3 por artículo
const maxH3 = 5;

// Función para procesar cada archivo
function procesarArchivo(inputFilePath, outputFilePath) {
    const data = fs.readFileSync(inputFilePath, 'utf8');

    const lines = data.split('\n');
    let h3Count = 0;
    let wordCount = 0;
    let dentroDeH2 = false;

    const processedLines = lines.map(line => {
        if (line.startsWith('## ')) {
            dentroDeH2 = true;
            wordCount = 0;
            return line; // Mantener H2 sin cambios
        }

        if (dentroDeH2 && line.trim() && !line.startsWith('#')) {
            const words = line.split(/\s+/).filter(Boolean);
            wordCount += words.length;

            // Convertir en H3 si supera las 150 palabras o tiene palabras clave
            if (wordCount >= 150 && h3Count < maxH3) {
                h3Count++;
                wordCount = 0;
                return `### ${line.trim()}`;
            }

            if (keywords.some(keyword => line.toLowerCase().includes(keyword)) && h3Count < maxH3) {
                h3Count++;
                return `### ${line.trim()}`;
            }
        }

        if (line.startsWith('#')) {
            dentroDeH2 = false;
        }

        return line;
    });

    fs.writeFileSync(outputFilePath, processedLines.join('\n'), 'utf8');
    console.log(`✅ Archivo procesado y guardado: ${outputFilePath}`);
}

// Procesar todos los archivos Markdown en la carpeta
fs.readdirSync(inputDir).forEach(file => {
    if (file.endsWith('.md')) {
        const inputFilePath = path.join(inputDir, file);
        const outputFilePath = path.join(outputDir, file);
        procesarArchivo(inputFilePath, outputFilePath);
    }
});

console.log('🚀 Todos los archivos han sido optimizados con un máximo de 15 H3.');
