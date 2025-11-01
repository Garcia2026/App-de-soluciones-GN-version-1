const fs = require('fs');
const content = fs.readFileSync('src/views/Cotizaciones.vue', 'utf8');
const lines = content.split('\n');

let depth = 0;
let inTemplate = false;
let maxDepth = 0;
let maxDepthLine = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('<template>')) {
    inTemplate = true;
    continue;
  }
  if (line.includes('</template>')) {
    console.log('\nLine ' + (i + 1) + ': End of template, final depth: ' + depth);
    console.log('Max depth was ' + maxDepth + ' at line ' + maxDepthLine);
    break;
  }

  if (!inTemplate) continue;

  // Count ALL opening divs
  const allOpenMatches = line.match(/<div/g);
  const allCloseMatches = line.match(/<\/div>/g);

  const openCount = allOpenMatches ? allOpenMatches.length : 0;
  const closeCount = allCloseMatches ? allCloseMatches.length : 0;

  const prevDepth = depth;
  depth += (openCount - closeCount);

  if (depth > maxDepth) {
    maxDepth = depth;
    maxDepthLine = i + 1;
  }

  if (openCount > 0 || closeCount > 0) {
    const linePreview = line.trim().substring(0, 70).replace(/\s+/g, ' ');
    console.log('L' + String(i + 1).padStart(4) + ': d=' + String(prevDepth).padStart(2) + ' +' + openCount + ' -' + closeCount + ' => d=' + String(depth).padStart(2) + ' | ' + linePreview);
  }
}
