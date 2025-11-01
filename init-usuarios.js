// Script para inicializar usuarios en Firebase
// Ejecutar con: node init-usuarios.js

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore'
import CryptoJS from 'crypto-js'

const firebaseConfig = {
  apiKey: "AIzaSyCdQ8BKiLkim2bW6T_yODvdXRzGek-HJmw",
  authDomain: "sistemasolucionesgn.firebaseapp.com",
  projectId: "sistemasolucionesgn",
  storageBucket: "sistemasolucionesgn.firebasestorage.app",
  messagingSenderId: "396884695171",
  appId: "1:396884695171:web:19e847374540fda094a3b6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Hash password
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString()
}

// Usuarios iniciales
const usuarios = [
  {
    username: 'byron.garcia',
    nombre: 'Byron García',
    email: 'solucionesintegralesgn@gmail.com',
    rol: 'administrador',
    password: hashPassword('123456'), // Contraseña inicial
    primerIngreso: true,
    activo: true,
    fechaCreacion: serverTimestamp(),
    ultimoAcceso: null
  },
  {
    username: 'eduardo.navarro',
    nombre: 'Eduardo Navarro',
    email: 'solucionesintegralesgn@gmail.com',
    rol: 'usuario',
    password: hashPassword('123456'), // Contraseña inicial
    primerIngreso: true,
    activo: true,
    fechaCreacion: serverTimestamp(),
    ultimoAcceso: null
  },
  {
    username: 'brandon.garcia',
    nombre: 'Brandon García',
    email: 'solucionesintegralesgn@gmail.com',
    rol: 'usuario',
    password: hashPassword('123456'), // Contraseña inicial
    primerIngreso: true,
    activo: true,
    fechaCreacion: serverTimestamp(),
    ultimoAcceso: null
  }
]

async function inicializarUsuarios() {
  console.log('🚀 Inicializando usuarios en Firebase...\n')

  try {
    for (const usuario of usuarios) {
      // Verificar si el usuario ya existe
      const q = query(collection(db, 'usuarios'), where('username', '==', usuario.username))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        console.log(`⚠️  Usuario ${usuario.username} ya existe - OMITIDO`)
        continue
      }

      // Crear usuario
      const docRef = await addDoc(collection(db, 'usuarios'), usuario)
      console.log(`✅ Usuario creado: ${usuario.nombre} (${usuario.username})`)
      console.log(`   Rol: ${usuario.rol}`)
      console.log(`   ID: ${docRef.id}`)
      console.log(`   Contraseña inicial: 123456\n`)
    }

    console.log('✨ Inicialización completada!')
    console.log('\n📝 Credenciales de acceso:')
    console.log('━'.repeat(50))
    console.log('Usuario: byron.garcia')
    console.log('Contraseña: 123456')
    console.log('Rol: Administrador')
    console.log('━'.repeat(50))
    console.log('Usuario: eduardo.navarro')
    console.log('Contraseña: 123456')
    console.log('Rol: Usuario')
    console.log('━'.repeat(50))
    console.log('Usuario: brandon.garcia')
    console.log('Contraseña: 123456')
    console.log('Rol: Usuario')
    console.log('━'.repeat(50))
    console.log('\n⚠️  IMPORTANTE: Todos los usuarios deben cambiar su contraseña en el primer ingreso\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error inicializando usuarios:', error)
    process.exit(1)
  }
}

inicializarUsuarios()
