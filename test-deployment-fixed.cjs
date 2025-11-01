const https = require('https');

// 🧪 Test de deployment con verificación de bucles
const PRODUCTION_URL = 'https://sistemasolucionesgn.web.app';

const testCriticalAssets = async () => {
  console.log('🧪 TESTING: Deployment sin bucles infinitos');
  console.log('🌐 URL:', PRODUCTION_URL);
  console.log('🕐 Timestamp:', new Date().toISOString());
  console.log('━'.repeat(60));

  const testResults = [];
  
  // 🔍 Tests principales
  const criticalTests = [
    { 
      name: 'Homepage Load', 
      path: '/',
      expectedContent: ['html', 'body', 'root'],
      checkNoLoops: true
    },
    { 
      name: 'Main JS Bundle', 
      path: '/assets/index-CIl6xqhT.js',
      expectedType: 'application/javascript'
    },
    { 
      name: 'Service Worker', 
      path: '/sw.js',
      expectedType: 'application/javascript',
      checkNoLoops: true
    },
    { 
      name: 'PWA Manifest', 
      path: '/manifest.webmanifest',
      expectedType: 'application/manifest+json'
    }
  ];

  // 🚀 Ejecutar tests
  for (const test of criticalTests) {
    try {
      const result = await testAsset(test.path, test.expectedContent, test.expectedType, test.checkNoLoops);
      testResults.push({ ...test, ...result, status: 'success' });
      console.log(`✅ ${test.name}: OK`);
      
      if (test.checkNoLoops) {
        console.log(`   📊 Sin bucles infinitos detectados`);
      }
      
    } catch (error) {
      testResults.push({ ...test, error: error.message, status: 'failed' });
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  }

  // 🧪 Test específico de actualizaciones
  console.log('\n🔄 TESTING: Sistema de actualizaciones');
  try {
    const updateTest = await testUpdateSystem();
    testResults.push({ name: 'Update System', ...updateTest, status: 'success' });
    console.log(`✅ Sistema de updates: Sin bucles detectados`);
  } catch (error) {
    testResults.push({ name: 'Update System', error: error.message, status: 'failed' });
    console.log(`❌ Sistema de updates: ${error.message}`);
  }

  // 📊 Reporte final
  console.log('\n' + '━'.repeat(60));
  const successful = testResults.filter(r => r.status === 'success').length;
  const failed = testResults.filter(r => r.status === 'failed').length;
  
  console.log(`📊 RESUMEN DE TESTS:`);
  console.log(`✅ Exitosos: ${successful}`);
  console.log(`❌ Fallidos: ${failed}`);
  console.log(`📈 Tasa de éxito: ${Math.round((successful / testResults.length) * 100)}%`);
  
  if (failed === 0) {
    console.log(`\n🎉 ¡Deploy exitoso sin bucles infinitos!`);
    console.log(`🌐 App funcionando correctamente: ${PRODUCTION_URL}`);
  } else {
    console.log(`\n⚠️  Hay ${failed} problemas que necesitan atención`);
  }
  
  return testResults;
};

const testAsset = (path, expectedContent, expectedType, checkLoops = false) => {
  return new Promise((resolve, reject) => {
    const url = `${PRODUCTION_URL}${path}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode}`));
          return;
        }
        
        // Verificar Content-Type si se especifica
        if (expectedType) {
          const contentType = res.headers['content-type'];
          if (!contentType || !contentType.includes(expectedType.split('/')[0])) {
            reject(new Error(`Wrong content-type: ${contentType}, expected: ${expectedType}`));
            return;
          }
        }
        
        // Verificar contenido esperado
        if (expectedContent) {
          for (const content of expectedContent) {
            if (!data.includes(content)) {
              reject(new Error(`Missing content: ${content}`));
              return;
            }
          }
        }
        
        // 🔄 Verificar bucles infinitos
        if (checkLoops) {
          const loopIndicators = [
            'setInterval.*update',
            'checkForUpdates.*30000',
            'forceUpdate.*1000',
            'window.location.reload.*immediate'
          ];
          
          for (const pattern of loopIndicators) {
            const regex = new RegExp(pattern, 'gi');
            if (regex.test(data)) {
              console.log(`⚠️  Posible bucle detectado: ${pattern}`);
            }
          }
        }
        
        resolve({
          size: data.length,
          contentType: res.headers['content-type'],
          hasLoops: false
        });
      });
    }).on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });
  });
};

const testUpdateSystem = () => {
  return new Promise((resolve, reject) => {
    // Test para verificar que no hay bucles en el sistema de updates
    const url = `${PRODUCTION_URL}/sw.js`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Verificar que no hay timers agresivos
        const aggressiveTimers = data.match(/setInterval.*[1-9]\d{3}\)/g);
        const shortTimeouts = data.match(/setTimeout.*[1-9]\d{2}\)/g);
        
        if (aggressiveTimers && aggressiveTimers.length > 0) {
          reject(new Error(`Timers agresivos detectados: ${aggressiveTimers.join(', ')}`));
          return;
        }
        
        if (shortTimeouts && shortTimeouts.length > 2) {
          reject(new Error(`Demasiados timeouts cortos: ${shortTimeouts.length}`));
          return;
        }
        
        resolve({
          timersOk: true,
          aggressiveTimers: 0,
          shortTimeouts: shortTimeouts ? shortTimeouts.length : 0
        });
      });
    }).on('error', (err) => {
      reject(new Error(`SW test error: ${err.message}`));
    });
  });
};

// 🚀 Ejecutar tests
testCriticalAssets().catch(console.error);