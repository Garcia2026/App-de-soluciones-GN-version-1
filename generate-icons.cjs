// Script para generar iconos PWA
const fs = require('fs');
const path = require('path');

// Función para crear un SVG del icono GN
function createGNIconSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#16a34a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#15803d;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0fdf4;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="4" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Fondo circular con gradiente -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.45}" fill="url(#mainGradient)" filter="url(#shadow)"/>
  
  <!-- Círculo interior para profundidad -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="${size*0.005}"/>
  
  <!-- Hojas decorativas de fondo -->
  <g opacity="0.15">
    <path d="M${size*0.25} ${size*0.3} Q${size*0.35} ${size*0.25} ${size*0.45} ${size*0.3} Q${size*0.35} ${size*0.35} ${size*0.25} ${size*0.3} Z" fill="#ffffff"/>
    <path d="M${size*0.65} ${size*0.65} Q${size*0.75} ${size*0.6} ${size*0.85} ${size*0.65} Q${size*0.75} ${size*0.7} ${size*0.65} ${size*0.65} Z" fill="#ffffff"/>
  </g>
  
  <!-- Texto GN -->
  <text x="${size/2}" y="${size*0.65}" text-anchor="middle" fill="url(#textGradient)" 
        font-family="Arial, sans-serif" font-weight="bold" font-size="${size*0.3}"
        style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">GN</text>
  
  <!-- Puntos decorativos -->
  <circle cx="${size*0.25}" cy="${size*0.2}" r="${size*0.015}" fill="#ffffff" opacity="0.8"/>
  <circle cx="${size*0.75}" cy="${size*0.25}" r="${size*0.01}" fill="#ffffff" opacity="0.6"/>
  <circle cx="${size*0.2}" cy="${size*0.8}" r="${size*0.01}" fill="#ffffff" opacity="0.7"/>
  <circle cx="${size*0.8}" cy="${size*0.85}" r="${size*0.015}" fill="#ffffff" opacity="0.5"/>
</svg>`;
}

// Crear diferentes tamaños de iconos
const iconSizes = [16, 32, 48, 72, 96, 144, 192, 256, 384, 512];
const publicDir = path.join(__dirname, 'public');

// Asegurar que el directorio public existe
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('🎨 Generando iconos PWA para GN Jardinería...');

// Generar SVG base
const baseSVG = createGNIconSVG(512);
fs.writeFileSync(path.join(publicDir, 'gn-icon.svg'), baseSVG);
console.log('✅ Icono SVG base creado');

// Generar iconos de diferentes tamaños (como SVG por simplicidad)
iconSizes.forEach(size => {
  const svg = createGNIconSVG(size);
  fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.svg`), svg);
  console.log(`✅ Icono ${size}x${size} creado`);
});

// Crear favicon ICO (como SVG)
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), createGNIconSVG(32));
console.log('✅ Favicon SVG creado');

// Crear apple-touch-icon
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), createGNIconSVG(180));
console.log('✅ Apple touch icon creado');

console.log(`
🚀 ¡Iconos generados exitosamente!

Archivos creados:
- gn-icon.svg (icono base)
- favicon.svg (favicon)
- apple-touch-icon.svg (icono de Apple)
- icon-{size}x{size}.svg (varios tamaños)

📱 Los iconos están optimizados para PWA y se verán perfectos
   cuando los usuarios instalen la app en sus dispositivos.

💡 Características:
   ✨ Gradiente moderno verde (tema de jardinería)
   🎨 Logo "GN" elegante y legible
   🌿 Elementos decorativos sutiles
   📱 Optimizado para todas las resoluciones
`);

module.exports = { createGNIconSVG };