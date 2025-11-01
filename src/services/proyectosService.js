// Servicio para gestionar proyectos en Firestore
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase.js'

const COLLECTION_NAME = 'proyectos'

export class ProyectosService {
  static get collection() {
    return collection(db, COLLECTION_NAME)
  }

  // Crear nuevo proyecto
  static async crearProyecto(proyectoData) {
    try {
      console.log('💾 Guardando proyecto en Firestore...', proyectoData.nombre)

      const docData = {
        ...proyectoData,
        gastos: proyectoData.gastos || [],
        fechaCreacion: serverTimestamp(),
        fechaActualizacion: serverTimestamp()
      }

      const docRef = await addDoc(this.collection, docData)
      console.log('✅ Proyecto guardado con ID:', docRef.id)

      return {
        id: docRef.id,
        ...proyectoData,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
    } catch (error) {
      console.error('❌ Error al guardar proyecto:', error)
      throw new Error(`Error al guardar proyecto: ${error.message}`)
    }
  }

  // Obtener todos los proyectos
  static async obtenerProyectos() {
    try {
      console.log('📥 Cargando proyectos desde Firestore...')

      const q = query(this.collection, orderBy('fechaCreacion', 'desc'))
      const querySnapshot = await getDocs(q)

      const proyectos = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        proyectos.push({
          id: doc.id,
          ...data,
          fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
          fechaActualizacion: data.fechaActualizacion?.toDate() || new Date()
        })
      })

      console.log(`✅ ${proyectos.length} proyectos cargados desde Firestore`)
      return proyectos
    } catch (error) {
      console.error('❌ Error al cargar proyectos:', error)
      throw new Error(`Error al cargar proyectos: ${error.message}`)
    }
  }

  // Actualizar proyecto
  static async actualizarProyecto(proyectoId, datosActualizados) {
    try {
      console.log('🔄 Actualizando proyecto:', proyectoId)

      const projectRef = doc(db, COLLECTION_NAME, proyectoId)
      await updateDoc(projectRef, {
        ...datosActualizados,
        fechaActualizacion: serverTimestamp()
      })

      console.log('✅ Proyecto actualizado:', proyectoId)
      return true
    } catch (error) {
      console.error('❌ Error al actualizar proyecto:', error)
      throw new Error(`Error al actualizar proyecto: ${error.message}`)
    }
  }

  // Eliminar proyecto
  static async eliminarProyecto(proyectoId) {
    try {
      console.log('🗑️ Eliminando proyecto:', proyectoId)

      const projectRef = doc(db, COLLECTION_NAME, proyectoId)
      await deleteDoc(projectRef)

      console.log('✅ Proyecto eliminado:', proyectoId)
      return true
    } catch (error) {
      console.error('❌ Error al eliminar proyecto:', error)
      throw new Error(`Error al eliminar proyecto: ${error.message}`)
    }
  }

  // Agregar gasto a proyecto
  static async agregarGasto(proyectoId, gasto) {
    try {
      console.log('💰 Agregando gasto al proyecto:', proyectoId)

      // Obtener el proyecto actual
      const proyectos = await this.obtenerProyectos()
      const proyecto = proyectos.find(p => p.id === proyectoId)

      if (!proyecto) {
        throw new Error('Proyecto no encontrado')
      }

      // Agregar el nuevo gasto
      const gastosActualizados = [...(proyecto.gastos || []), {
        ...gasto,
        id: `expense_${Date.now()}`,
        fechaCreacion: new Date()
      }]

      // Actualizar el proyecto
      await this.actualizarProyecto(proyectoId, {
        gastos: gastosActualizados
      })

      console.log('✅ Gasto agregado al proyecto:', proyectoId)
      return gastosActualizados
    } catch (error) {
      console.error('❌ Error al agregar gasto:', error)
      throw new Error(`Error al agregar gasto: ${error.message}`)
    }
  }

  // Actualizar gasto específico
  static async actualizarGasto(proyectoId, gastoId, datosGasto) {
    try {
      console.log('✏️ Actualizando gasto:', gastoId, 'en proyecto:', proyectoId)

      // Obtener el proyecto actual
      const proyectos = await this.obtenerProyectos()
      const proyecto = proyectos.find(p => p.id === proyectoId)

      if (!proyecto) {
        throw new Error('Proyecto no encontrado')
      }

      // Actualizar el gasto específico
      const gastosActualizados = (proyecto.gastos || []).map(gasto =>
        gasto.id === gastoId
          ? { ...datosGasto, id: gastoId, fechaActualizacion: new Date() }
          : gasto
      )

      // Actualizar el proyecto
      await this.actualizarProyecto(proyectoId, {
        gastos: gastosActualizados
      })

      console.log('✅ Gasto actualizado:', gastoId)
      return gastosActualizados
    } catch (error) {
      console.error('❌ Error al actualizar gasto:', error)
      throw new Error(`Error al actualizar gasto: ${error.message}`)
    }
  }

  // Eliminar gasto específico
  static async eliminarGasto(proyectoId, gastoId) {
    try {
      console.log('🗑️ Eliminando gasto:', gastoId, 'del proyecto:', proyectoId)

      // Obtener el proyecto actual
      const proyectos = await this.obtenerProyectos()
      const proyecto = proyectos.find(p => p.id === proyectoId)

      if (!proyecto) {
        throw new Error('Proyecto no encontrado')
      }

      // Filtrar el gasto a eliminar
      const gastosActualizados = (proyecto.gastos || []).filter(gasto => gasto.id !== gastoId)

      // Actualizar el proyecto
      await this.actualizarProyecto(proyectoId, {
        gastos: gastosActualizados
      })

      console.log('✅ Gasto eliminado:', gastoId)
      return gastosActualizados
    } catch (error) {
      console.error('❌ Error al eliminar gasto:', error)
      throw new Error(`Error al eliminar gasto: ${error.message}`)
    }
  }

  // Escuchar cambios en tiempo real
  static onProyectosChange(callback) {
    console.log('👂 Iniciando listener de proyectos en tiempo real...')

    const q = query(this.collection, orderBy('fechaCreacion', 'desc'))

    return onSnapshot(q, (querySnapshot) => {
      const proyectos = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        proyectos.push({
          id: doc.id,
          ...data,
          fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
          fechaActualizacion: data.fechaActualizacion?.toDate() || new Date()
        })
      })

      console.log(`🔄 Proyectos actualizados en tiempo real: ${proyectos.length}`)
      callback(proyectos)
    }, (error) => {
      console.error('❌ Error en listener de proyectos:', error)
    })
  }
}

export default ProyectosService