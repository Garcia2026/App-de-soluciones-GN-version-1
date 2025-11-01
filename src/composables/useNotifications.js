import { ref, computed } from 'vue'
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { db, isFirebaseReady } from '@/firebase'

export function useNotifications() {
  const notifications = ref([])
  const loading = ref(false)

  // Obtener notificaciones de pagos atrasados y próximos
  const fetchPaymentNotifications = async () => {
    try {
      if (!isFirebaseReady()) {
        console.warn('⚠️ Firebase no está inicializado para notificaciones')
        return []
      }

      const ahora = new Date()
      const en7Dias = new Date()
      en7Dias.setDate(ahora.getDate() + 7)

      // Obtener cobros pendientes
      const cobrosRef = collection(db, 'cobros')
      const cobrosQuery = query(
        cobrosRef,
        where('estado', '==', 'pendiente'),
        orderBy('fecha_vencimiento', 'asc')
      )
      const cobrosSnapshot = await getDocs(cobrosQuery)

      const paymentNotifs = []

      cobrosSnapshot.docs.forEach(doc => {
        const data = doc.data()
        const fechaVencimiento = data.fecha_vencimiento?.toDate() || new Date(data.fecha_vencimiento)
        const diasRestantes = Math.ceil((fechaVencimiento - ahora) / (1000 * 60 * 60 * 24))

        // Pagos atrasados
        if (diasRestantes < 0) {
          paymentNotifs.push({
            id: `cobro-${doc.id}`,
            type: 'pago_atrasado',
            priority: 'urgent',
            title: 'Pago Atrasado',
            message: `${data.cliente || 'Cliente'} - Q${formatNumber(data.monto)}`,
            detail: `Venció hace ${Math.abs(diasRestantes)} días`,
            date: fechaVencimiento,
            amount: data.monto,
            route: '/cobros',
            icon: 'alert-circle',
            color: 'red'
          })
        }
        // Pagos próximos (próximos 7 días)
        else if (diasRestantes >= 0 && diasRestantes <= 7) {
          paymentNotifs.push({
            id: `cobro-${doc.id}`,
            type: 'pago_proximo',
            priority: diasRestantes <= 3 ? 'high' : 'medium',
            title: 'Pago Próximo',
            message: `${data.cliente || 'Cliente'} - Q${formatNumber(data.monto)}`,
            detail: diasRestantes === 0 ? 'Vence hoy' : `Vence en ${diasRestantes} días`,
            date: fechaVencimiento,
            amount: data.monto,
            route: '/cobros',
            icon: 'clock',
            color: diasRestantes <= 3 ? 'orange' : 'yellow'
          })
        }
      })

      return paymentNotifs
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones de pagos:', error)
      return []
    }
  }

  // Obtener notificaciones de cronograma de tiendas
  const fetchStoreScheduleNotifications = async () => {
    try {
      if (!isFirebaseReady()) {
        console.warn('⚠️ Firebase no está inicializado para cronograma')
        return []
      }

      const ahora = new Date()
      const en7Dias = new Date()
      en7Dias.setDate(ahora.getDate() + 7)

      // Obtener tiendas con cronograma pendiente
      const tiendasRef = collection(db, 'tiendas')
      const tiendasSnapshot = await getDocs(tiendasRef)

      const scheduleNotifs = []

      tiendasSnapshot.docs.forEach(doc => {
        const data = doc.data()

        // Verificar si tiene cronograma
        if (data.cronograma && Array.isArray(data.cronograma)) {
          data.cronograma.forEach((actividad, index) => {
            // Solo actividades pendientes o en progreso
            if (actividad.estado === 'pendiente' || actividad.estado === 'en_progreso') {
              const fechaActividad = actividad.fecha?.toDate() || new Date(actividad.fecha)
              const diasRestantes = Math.ceil((fechaActividad - ahora) / (1000 * 60 * 60 * 24))

              // Actividades atrasadas
              if (diasRestantes < 0) {
                scheduleNotifs.push({
                  id: `cronograma-${doc.id}-${index}`,
                  type: 'cronograma_atrasado',
                  priority: 'urgent',
                  title: 'Cronograma Atrasado',
                  message: `${data.nombre || 'Tienda'} - ${actividad.actividad || 'Actividad'}`,
                  detail: `Atrasado ${Math.abs(diasRestantes)} días`,
                  date: fechaActividad,
                  route: '/tiendas',
                  icon: 'calendar-x',
                  color: 'red',
                  storeId: doc.id
                })
              }
              // Actividades próximas (próximos 7 días)
              else if (diasRestantes >= 0 && diasRestantes <= 7) {
                scheduleNotifs.push({
                  id: `cronograma-${doc.id}-${index}`,
                  type: 'cronograma_proximo',
                  priority: diasRestantes <= 2 ? 'high' : 'medium',
                  title: 'Cronograma Próximo',
                  message: `${data.nombre || 'Tienda'} - ${actividad.actividad || 'Actividad'}`,
                  detail: diasRestantes === 0 ? 'Hoy' : `En ${diasRestantes} días`,
                  date: fechaActividad,
                  route: '/tiendas',
                  icon: 'calendar',
                  color: diasRestantes <= 2 ? 'orange' : 'blue',
                  storeId: doc.id
                })
              }
            }
          })
        }
      })

      return scheduleNotifs
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones de cronograma:', error)
      return []
    }
  }

  // Obtener todas las notificaciones
  const fetchAllNotifications = async () => {
    loading.value = true
    try {
      const [paymentNotifs, scheduleNotifs] = await Promise.all([
        fetchPaymentNotifications(),
        fetchStoreScheduleNotifications()
      ])

      // Combinar y ordenar por prioridad y fecha
      const allNotifs = [...paymentNotifs, ...scheduleNotifs]

      // Ordenar: urgentes primero, luego por fecha
      allNotifs.sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]

        if (priorityDiff !== 0) return priorityDiff
        return new Date(a.date) - new Date(b.date)
      })

      notifications.value = allNotifs
      return allNotifs
    } catch (error) {
      console.error('❌ Error obteniendo todas las notificaciones:', error)
      notifications.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Computed properties para categorías de notificaciones
  const urgentNotifications = computed(() =>
    notifications.value.filter(n => n.priority === 'urgent')
  )

  const highPriorityNotifications = computed(() =>
    notifications.value.filter(n => n.priority === 'high')
  )

  const paymentNotifications = computed(() =>
    notifications.value.filter(n => n.type.includes('pago'))
  )

  const scheduleNotifications = computed(() =>
    notifications.value.filter(n => n.type.includes('cronograma'))
  )

  const totalNotifications = computed(() => notifications.value.length)

  const hasUrgentNotifications = computed(() => urgentNotifications.value.length > 0)

  // Utility function
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-GT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number)
  }

  return {
    notifications,
    loading,
    urgentNotifications,
    highPriorityNotifications,
    paymentNotifications,
    scheduleNotifications,
    totalNotifications,
    hasUrgentNotifications,
    fetchAllNotifications,
    fetchPaymentNotifications,
    fetchStoreScheduleNotifications
  }
}
