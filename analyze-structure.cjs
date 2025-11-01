const fs = require('fs');
const content = fs.readFileSync('src/views/Cotizaciones.vue', 'utf8');
const lines = content.split('\n');

// Find key lines
console.log('=== KEY STRUCTURE LINES ===\n');

const keyPatterns = [
  'tabs-container',
  'tabs-navigation',
  'tabs-content',
  'tab-panel',
  'Nueva Cotización',
  'Cotizaciones Guardadas'
];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;

  for (const pattern of keyPatterns) {
    if (line.includes(pattern)) {
      // Count indentation
      const indent = line.match(/^(\s*)/)[1].length;
      const opens = (line.match(/<div/g) || []).length;
      const closes = (line.match(/<\/div>/g) || []).length;

      console.log(
        'L' + String(lineNum).padStart(4) +
        ' [indent:' + String(indent).padStart(2) + ']' +
        ' [+' + opens + ' -' + closes + '] ' +
        line.trim().substring(0, 80)
      );
      break;
    }
  }
}
