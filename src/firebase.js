// Firebase configuration - Sistema Soluciones GN
// CONFIGURACIÓN SIMPLE Y DIRECTA PARA APLICACIÓN 100% ONLINE

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCdQ8BKiLkim2bW6T_yODvdXRzGek-HJmw",
  authDomain: "sistemasolucionesgn.firebaseapp.com",
  projectId: "sistemasolucionesgn",
  storageBucket: "sistemasolucionesgn.firebasestorage.app",
  messagingSenderId: "396884695171",
  appId: "1:396884695171:web:19e847374540fda094a3b6"
};

// Initialize Firebase immediately - NO LAZY LOADING
console.log('🚀 Inicializando Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Auto signin anonymous for immediate access
// NOTA: Si ves errores de autenticación, habilita "Anonymous" en Firebase Console
// Authentication > Sign-in method > Anonymous > Enable
signInAnonymously(auth).then(() => {
  console.log('✅ Firebase inicializado y conectado');
}).catch(error => {
  // Silenciar error de autenticación anónima si está deshabilitada
  if (error.code === 'auth/admin-restricted-operation') {
    console.log('ℹ️ Firebase inicializado (sin auth anónima)');
  } else {
    console.warn('⚠️ Auth anónimo falló:', error.message);
  }
});

// Simple connection test
export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Probando conexión a Firestore...');
    return true;
  } catch (error) {
    console.error('❌ Error probando conexión a Firestore:', error);
    return false;
  }
};

// Simple ready check
export const isFirebaseReady = () => {
  return !!(app && db);
};

// Direct exports - SIMPLE AND STRAIGHTFORWARD
export { app, db, auth, storage, firebaseConfig };
export default { app, db, auth, storage, config: firebaseConfig };