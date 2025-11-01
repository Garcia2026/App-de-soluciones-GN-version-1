// Composable de Autenticación - Sistema Soluciones GN
import { ref, computed } from 'vue'
import { db } from '@/firebase'
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import CryptoJS from 'crypto-js'

const currentUser = ref(null)
const isAuthenticated = ref(false)

// Hashear contraseña con SHA-256
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString()
}

// Generar código de recuperación de 6 dígitos
const generateRecoveryCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function useAuth() {

  // LOGIN
  const login = async (username, password) => {
    try {
      // Buscar usuario por username
      const usuariosRef = collection(db, 'usuarios')
      const q = query(usuariosRef, where('username', '==', username.toLowerCase()))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        throw new Error('Usuario no encontrado')
      }

      const userDoc = snapshot.docs[0]
      const userData = userDoc.data()

      // Verificar contraseña
      const hashedPassword = hashPassword(password)
      if (userData.password !== hashedPassword) {
        throw new Error('Contraseña incorrecta')
      }

      // Verificar si está activo
      if (!userData.activo) {
        throw new Error('Usuario desactivado. Contacte al administrador.')
      }

      // Actualizar último acceso
      await updateDoc(doc(db, 'usuarios', userDoc.id), {
        ultimoAcceso: serverTimestamp()
      })

      // Registrar en bitácora
      await registrarBitacora(userDoc.id, userData.nombre, 'login', 'Inicio de sesión exitoso')

      // Establecer usuario actual
      currentUser.value = {
        id: userDoc.id,
        ...userData
      }
      isAuthenticated.value = true

      // Guardar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))

      return {
        success: true,
        user: currentUser.value,
        requiresPasswordChange: userData.primerIngreso
      }

    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // LOGOUT
  const logout = async () => {
    if (currentUser.value) {
      // Registrar en bitácora
      await registrarBitacora(
        currentUser.value.id,
        currentUser.value.nombre,
        'logout',
        'Cierre de sesión'
      )
    }

    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('currentUser')
  }

  // CAMBIAR CONTRASEÑA
  const cambiarPassword = async (userId, newPassword) => {
    try {
      const hashedPassword = hashPassword(newPassword)

      await updateDoc(doc(db, 'usuarios', userId), {
        password: hashedPassword,
        primerIngreso: false,
        fechaCambioPassword: serverTimestamp()
      })

      // Registrar en bitácora
      await registrarBitacora(userId, currentUser.value?.nombre || 'Usuario', 'cambio_password', 'Cambio de contraseña exitoso')

      // Actualizar usuario actual
      if (currentUser.value && currentUser.value.id === userId) {
        currentUser.value.primerIngreso = false
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      }

      return { success: true }
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      return { success: false, error: error.message }
    }
  }

  // SOLICITAR CÓDIGO DE RECUPERACIÓN
  const solicitarCodigoRecuperacion = async (username) => {
    try {
      // Buscar usuario
      const usuariosRef = collection(db, 'usuarios')
      const q = query(usuariosRef, where('username', '==', username.toLowerCase()))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        throw new Error('Usuario no encontrado')
      }

      const userDoc = snapshot.docs[0]
      const userData = userDoc.data()

      // Generar código
      const codigo = generateRecoveryCode()
      const expiracion = new Date()
      expiracion.setMinutes(expiracion.getMinutes() + 15) // Válido por 15 minutos

      // Guardar código en Firestore
      await updateDoc(doc(db, 'usuarios', userDoc.id), {
        codigoRecuperacion: codigo,
        codigoExpiracion: expiracion
      })

      // Registrar en bitácora
      await registrarBitacora(userDoc.id, userData.nombre, 'solicitud_recuperacion', 'Solicitud de código de recuperación')

      return {
        success: true,
        codigo: codigo, // En producción, esto se enviaría por email
        email: 'solucionesintegralesgn@gmail.com',
        userId: userDoc.id
      }
    } catch (error) {
      console.error('Error solicitando código:', error)
      return { success: false, error: error.message }
    }
  }

  // VERIFICAR CÓDIGO Y CAMBIAR CONTRASEÑA
  const recuperarPassword = async (username, codigo, newPassword) => {
    try {
      // Buscar usuario
      const usuariosRef = collection(db, 'usuarios')
      const q = query(usuariosRef, where('username', '==', username.toLowerCase()))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        throw new Error('Usuario no encontrado')
      }

      const userDoc = snapshot.docs[0]
      const userData = userDoc.data()

      // Verificar código
      if (userData.codigoRecuperacion !== codigo) {
        throw new Error('Código incorrecto')
      }

      // Verificar expiración
      const expiracion = userData.codigoExpiracion?.toDate()
      if (!expiracion || new Date() > expiracion) {
        throw new Error('Código expirado. Solicite uno nuevo.')
      }

      // Cambiar contraseña
      const hashedPassword = hashPassword(newPassword)
      await updateDoc(doc(db, 'usuarios', userDoc.id), {
        password: hashedPassword,
        codigoRecuperacion: null,
        codigoExpiracion: null,
        fechaCambioPassword: serverTimestamp()
      })

      // Registrar en bitácora
      await registrarBitacora(userDoc.id, userData.nombre, 'recuperacion_password', 'Recuperación de contraseña exitosa')

      return { success: true }
    } catch (error) {
      console.error('Error recuperando contraseña:', error)
      return { success: false, error: error.message }
    }
  }

  // REGISTRAR EN BITÁCORA
  const registrarBitacora = async (usuarioId, usuarioNombre, accion, detalles = '', datos = null) => {
    try {
      await addDoc(collection(db, 'bitacora'), {
        usuarioId,
        usuarioNombre,
        accion,
        detalles,
        datos: datos || {},
        fecha: serverTimestamp(),
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error registrando en bitácora:', error)
    }
  }

  // RESTAURAR SESIÓN
  const restaurarSesion = () => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser)
        isAuthenticated.value = true
        return true
      } catch (error) {
        console.error('Error restaurando sesión:', error)
        localStorage.removeItem('currentUser')
        return false
      }
    }
    return false
  }

  // VERIFICAR SI ES ADMINISTRADOR
  const isAdmin = computed(() => {
    return currentUser.value?.rol === 'administrador'
  })

  return {
    // Estado
    currentUser,
    isAuthenticated,
    isAdmin,

    // Métodos
    login,
    logout,
    cambiarPassword,
    solicitarCodigoRecuperacion,
    recuperarPassword,
    registrarBitacora,
    restaurarSesion,
    hashPassword
  }
}
