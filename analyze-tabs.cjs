const fs = require('fs');
const content = fs.readFileSync('src/views/Cotizaciones.vue', 'utf8');
const lines = content.split('\n');

let depth = 0;
let start = 66; // line 67 (0-indexed is 66)
let end = 641;  // line 642 (0-indexed is 641)

console.log('Analyzing tabs-content section (lines 67-642):\n');

for (let i = start; i <= end && i < lines.length; i++) {
  const line = lines[i];

  // Count opening divs
  const opens = (line.match(/<div[^>]*>/g) || []).length;
  // Count closing divs
  const closes = (line.match(/<\/div>/g) || []).length;

  const prevDepth = depth;
  depth += (opens - closes);

  if (opens > 0 || closes > 0) {
    const lineNum = i + 1;
    const snippet = line.trim().substring(0, 70).replace(/\s+/g, ' ');
    console.log('L' + String(lineNum).padStart(4) + ': d=' + String(prevDepth).padStart(2) + ' +' + opens + ' -' + closes + ' => ' + String(depth).padStart(2) + ' | ' + snippet);
  }

  if (depth < 0) {
    console.log('\nERROR: Negative depth at line ' + (i + 1));
    break;
  }
}

console.log('\n===================');
console.log('Final depth: ' + depth);
console.log('Missing closing divs: ' + depth);
