const fs = require('fs');
const path = require('path');

// Ruta de la carpeta donde están los archivos Markdown
const carpetaArticulos = path.join(__dirname, 'articulos_markdown');

// Lista de palabras clave
const palabrasClave = [
    'importante', 'beneficios', 'ventajas', 'riesgos', 'cómo',
    'salud', 'nutrición', 'bienestar', 'clave', 'consejo', 'prevención',
    'proteínas', 'vitaminas', 'minerales', 'antioxidantes', 'energía',
    'sistema inmunológico', 'digestión', 'equilibrio', 'dieta'
];

// Verificar si la carpeta existe
if (!fs.existsSync(carpetaArticulos)) {
    console.error('❌ La carpeta de artículos no existe.');
    process.exit(1);
}

// Expresión regular para buscar palabras clave dentro de **negritas**
const regexPalabras = new RegExp(`\\*\\*(${palabrasClave.join('|')})\\*\\*`, 'gi');

// Procesar cada archivo .md
fs.readdirSync(carpetaArticulos).forEach((archivo) => {
    if (archivo.endsWith('.md')) {
        const rutaArchivo = path.join(carpetaArticulos, archivo);
        let contenido = fs.readFileSync(rutaArchivo, 'utf8');

        // Eliminar las negritas de las palabras clave
        const contenidoLimpio = contenido.replace(regexPalabras, '$1');

        // Guardar el archivo con las negritas eliminadas
        fs.writeFileSync(rutaArchivo, contenidoLimpio, 'utf8');
        console.log(`✅ Negritas eliminadas en: ${archivo}`);
    }
});

console.log('🚀 Proceso completado. Todas las palabras clave han sido limpiadas.');
