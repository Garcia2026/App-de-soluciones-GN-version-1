const fs = require('fs');
const content = fs.readFileSync('src/views/Cotizaciones.vue', 'utf8');
const lines = content.split('\n');

let depth = 0;
let inTemplate = false;
let templateStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.trim() === '<template>') {
    inTemplate = true;
    templateStart = i;
    continue;
  }
  if (line.trim() === '</template>') {
    inTemplate = false;
    console.log('Line ' + (i + 1) + ': Final depth at end of template: ' + depth);
    if (depth !== 0) {
      console.log('ERROR: Unbalanced divs! Missing ' + depth + ' closing div(s)');
    }
    break;
  }

  if (!inTemplate) continue;

  // Count opening divs (not self-closing)
  const openDivs = (line.match(/<div[^>]*(?<!\/)>/g) || []).length;
  // Count closing divs
  const closeDivs = (line.match(/<\/div>/g) || []).length;

  const prevDepth = depth;
  depth += (openDivs - closeDivs);

  if (openDivs > 0 || closeDivs > 0) {
    console.log('Line ' + (i + 1) + ': depth=' + prevDepth + ' open=' + openDivs + ' close=' + closeDivs + ' newDepth=' + depth + ' | ' + line.trim().substring(0, 60));
  }

  if (depth < 0) {
    console.log('NEGATIVE DEPTH at line ' + (i + 1));
    break;
  }
}
