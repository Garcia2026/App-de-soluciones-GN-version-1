// Servicio para probar las funcionalidades de Firebase
import { db, isFirebaseReady } from '../firebase.js';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

/**
 * Servicio de pruebas para Firebase
 */
export class FirebaseTestService {
  /**
   * Verifica el estado de Firebase y las colecciones
   */
  static async verificarEstado() {
    const estado = {
      firebaseReady: isFirebaseReady(),
      colecciones: {},
      errores: []
    };

    if (!estado.firebaseReady) {
      estado.errores.push('Firebase no está inicializado');
      return estado;
    }

    // Verificar cada colección
    const colecciones = [
      'cotizaciones',
      'movimientos_financieros', 
      'don_eduardo_movimientos',
      'cobros',
      'gastos'
    ];

    for (const nombreColeccion of colecciones) {
      try {
        const snapshot = await getDocs(query(
          collection(db, nombreColeccion), 
          limit(1)
        ));
        
        estado.colecciones[nombreColeccion] = {
          existe: true,
          documentos: snapshot.size,
          accesible: true
        };
      } catch (error) {
        estado.colecciones[nombreColeccion] = {
          existe: false,
          error: error.message,
          accesible: false
        };
        estado.errores.push(`Error en ${nombreColeccion}: ${error.message}`);
      }
    }

    return estado;
  }

  /**
   * Obtiene estadísticas de las colecciones
   */
  static async obtenerEstadisticas() {
    if (!isFirebaseReady()) {
      return { error: 'Firebase no disponible' };
    }

    const stats = {};

    try {
      // Cotizaciones por estado
      const cotizacionesSnapshot = await getDocs(collection(db, 'cotizaciones'));
      const cotizaciones = cotizacionesSnapshot.docs.map(doc => doc.data());
      
      stats.cotizaciones = {
        total: cotizaciones.length,
        borrador: cotizaciones.filter(c => c.estado === 'borrador').length,
        enviada: cotizaciones.filter(c => c.estado === 'enviada').length,
        aceptada: cotizaciones.filter(c => c.estado === 'aceptada').length,
        rechazada: cotizaciones.filter(c => c.estado === 'rechazada').length
      };

      // Movimientos financieros
      const movimientosSnapshot = await getDocs(collection(db, 'movimientos_financieros'));
      const movimientos = movimientosSnapshot.docs.map(doc => doc.data());
      
      stats.movimientos = {
        total: movimientos.length,
        ingresos: movimientos.filter(m => m.tipo === 'ingreso').length,
        gastos: movimientos.filter(m => m.tipo === 'gasto').length,
        montoTotal: movimientos.reduce((sum, m) => {
          return sum + (m.tipo === 'ingreso' ? m.monto : -m.monto);
        }, 0)
      };

      // Don Eduardo
      const donEduardoSnapshot = await getDocs(collection(db, 'don_eduardo_movimientos'));
      stats.donEduardo = {
        total: donEduardoSnapshot.size
      };

      return stats;
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Crea datos de ejemplo para probar el sistema
   */
  static async crearDatosEjemplo() {
    if (!isFirebaseReady()) {
      throw new Error('Firebase no disponible');
    }

    const resultados = {
      cotizacion: null,
      movimiento: null,
      donEduardo: null
    };

    try {
      // Crear cotización de ejemplo
      const cotizacionEjemplo = {
        numero: `COT-EJEMPLO-${Date.now()}`,
        cliente: 'Cliente Ejemplo - Prueba Sistema',
        contacto: 'Juan Pérez',
        telefono: '1234-5678',
        fecha: new Date().toISOString().split('T')[0],
        validez: 15,
        tipoServicio: 'jardinizacion',
        estado: 'borrador',
        productos: [
          {
            cantidad: 10,
            descripcion: 'Duranta amarillas doradas',
            precioUnitario: 10.00
          },
          {
            cantidad: 5,
            descripcion: 'Palmera Phoenix',
            precioUnitario: 150.00
          }
        ],
        serviciosIncluidos: [
          'Suministro de todas las plantas y materiales descritos',
          'Plantación y distribución según diseño'
        ],
        condiciones: 'Cotización de ejemplo para pruebas del sistema',
        subtotal: 850.00,
        iva: 102.00,
        total: 952.00,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        version: 1
      };

      const cotizacionDoc = await addDoc(collection(db, 'cotizaciones'), cotizacionEjemplo);
      resultados.cotizacion = { id: cotizacionDoc.id, ...cotizacionEjemplo };

      // Crear movimiento financiero de ejemplo
      const movimientoEjemplo = {
        descripcion: 'Ingreso ejemplo - Prueba Sistema',
        categoria: 'Servicios Pagados',
        tipo: 'ingreso',
        monto: 1500.00,
        fecha: new Date(),
        fechaCreacion: new Date()
      };

      const movimientoDoc = await addDoc(collection(db, 'movimientos_financieros'), movimientoEjemplo);
      resultados.movimiento = { id: movimientoDoc.id, ...movimientoEjemplo };

      // Crear movimiento Don Eduardo de ejemplo
      const donEduardoEjemplo = {
        tipo: 'pago_recibido',
        monto: 5000.00,
        descripcion: 'Pago ejemplo - Prueba Sistema',
        fecha: new Date(),
        fechaCreacion: new Date(),
        proveedor: 'Don Eduardo'
      };

      const donEduardoDoc = await addDoc(collection(db, 'don_eduardo_movimientos'), donEduardoEjemplo);
      resultados.donEduardo = { id: donEduardoDoc.id, ...donEduardoEjemplo };

      return resultados;

    } catch (error) {
      throw new Error(`Error creando datos de ejemplo: ${error.message}`);
    }
  }
}

export default FirebaseTestService;