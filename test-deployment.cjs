#!/usr/bin/env node
// 🧪 Test de Verificación de Deploy - GN Jardinería Premium

const https = require('https');
const url = require('url');

const DEPLOYMENT_URL = 'https://sistemasolucionesgn.web.app';
const CRITICAL_ASSETS = [
  '/',
  '/assets/index-B5RY408J.js',
  '/assets/react-vendor-DtOhX2xw.js', 
  '/assets/charts-vendor-BfD--HEg.js',
  '/assets/firebase-vendor-Bk7cPWOZ.js',
  '/assets/index-DPgj9QR-.css',
  '/sw.js',
  '/manifest.webmanifest'
];

function checkUrl(testUrl) {
  return new Promise((resolve, reject) => {
    const options = url.parse(testUrl);
    options.method = 'HEAD';
    
    const req = https.request(options, (res) => {
      resolve({
        url: testUrl,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        cacheControl: res.headers['cache-control'],
        success: res.statusCode === 200
      });
    });
    
    req.on('error', (err) => {
      reject({ url: testUrl, error: err.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject({ url: testUrl, error: 'Timeout' });
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Iniciando tests de verificación del deploy...\n');
  console.log('🚀 URL: ' + DEPLOYMENT_URL);
  console.log('📦 Verificando ' + CRITICAL_ASSETS.length + ' assets críticos...\n');
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (const asset of CRITICAL_ASSETS) {
    try {
      const result = await checkUrl(DEPLOYMENT_URL + asset);
      results.push(result);
      
      if (result.success) {
        console.log(`✅ ${asset} - ${result.status} (${result.contentType})`);
        successCount++;
      } else {
        console.log(`❌ ${asset} - ${result.status}`);
        failCount++;
      }
    } catch (error) {
      console.log(`💥 ${asset} - ERROR: ${error.error}`);
      failCount++;
      results.push(error);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE TESTS:');
  console.log('✅ Exitosos: ' + successCount);
  console.log('❌ Fallidos: ' + failCount);
  console.log('📈 Tasa de éxito: ' + Math.round((successCount / CRITICAL_ASSETS.length) * 100) + '%');
  
  if (failCount === 0) {
    console.log('\n🎉 ¡Todos los tests pasaron! Deploy exitoso.');
    console.log('🌐 La aplicación está funcionando correctamente en:');
    console.log('   ' + DEPLOYMENT_URL);
    console.log('\n🎨 Componentes Premium disponibles:');
    console.log('   • 🏢 Dashboard Enterprise');
    console.log('   • 💎 Finanzas Premium'); 
    console.log('   • 👑 Servicios Premium');
    console.log('   • 🧮 Estadísticas Avanzadas');
  } else {
    console.log('\n⚠️  Algunos tests fallaron. Revisa los errores arriba.');
    process.exit(1);
  }
}

runTests().catch(console.error);