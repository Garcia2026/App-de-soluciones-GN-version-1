<template>
  <div class="notifications-panel">
    <!-- Header -->
    <div class="panel-header">
      <div class="header-content">
        <div class="header-icon">
          <Bell :size="24" class="bell-icon" :class="{ 'has-urgent': hasUrgentNotifications }" />
          <span v-if="totalNotifications > 0" class="notification-badge" :class="{ 'urgent': hasUrgentNotifications }">
            {{ totalNotifications > 99 ? '99+' : totalNotifications }}
          </span>
        </div>
        <div class="header-text">
          <h3 class="header-title">Notificaciones Pendientes</h3>
          <p class="header-subtitle">
            {{ totalNotifications === 0 ? 'No hay pendientes' : `${totalNotifications} ${totalNotifications === 1 ? 'pendiente' : 'pendientes'}` }}
          </p>
        </div>
      </div>
      <button v-if="totalNotifications > 0" @click="$emit('refresh')" class="refresh-btn" title="Actualizar">
        <RefreshCw :size="18" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <Loader2 :size="32" class="spin-icon" />
      <p>Cargando notificaciones...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="totalNotifications === 0" class="empty-state">
      <CheckCircle2 :size="64" class="success-icon" />
      <h4>¡Todo al día!</h4>
      <p>No tienes pendientes en este momento</p>
    </div>

    <!-- Notifications List -->
    <div v-else class="notifications-list">
      <!-- Urgentes -->
      <div v-if="urgentNotifications.length > 0" class="notification-group">
        <div class="group-header urgent">
          <AlertCircle :size="18" />
          <span>Urgentes ({{ urgentNotifications.length }})</span>
        </div>
        <NotificationItem
          v-for="notif in urgentNotifications"
          :key="notif.id"
          :notification="notif"
          @click="handleNotificationClick(notif)"
        />
      </div>

      <!-- Alta Prioridad -->
      <div v-if="highPriorityNotifications.length > 0" class="notification-group">
        <div class="group-header high">
          <AlertTriangle :size="18" />
          <span>Importantes ({{ highPriorityNotifications.length }})</span>
        </div>
        <NotificationItem
          v-for="notif in highPriorityNotifications"
          :key="notif.id"
          :notification="notif"
          @click="handleNotificationClick(notif)"
        />
      </div>

      <!-- Otras Prioridades -->
      <div v-if="otherNotifications.length > 0" class="notification-group">
        <div class="group-header normal">
          <Info :size="18" />
          <span>Próximas ({{ otherNotifications.length }})</span>
        </div>
        <NotificationItem
          v-for="notif in otherNotifications"
          :key="notif.id"
          :notification="notif"
          @click="handleNotificationClick(notif)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  Loader2
} from 'lucide-vue-next'
import NotificationItem from './NotificationItem.vue'

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  urgentNotifications: { type: Array, default: () => [] },
  highPriorityNotifications: { type: Array, default: () => [] }
})

defineEmits(['refresh'])

const router = useRouter()

const totalNotifications = computed(() => props.notifications.length)

const hasUrgentNotifications = computed(() => props.urgentNotifications.length > 0)

const otherNotifications = computed(() => {
  const urgentIds = new Set(props.urgentNotifications.map(n => n.id))
  const highIds = new Set(props.highPriorityNotifications.map(n => n.id))
  return props.notifications.filter(n => !urgentIds.has(n.id) && !highIds.has(n.id))
})

const handleNotificationClick = (notification) => {
  if (notification.route) {
    router.push(notification.route)
  }
}
</script>

<style scoped>
.notifications-panel {
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);
  border-radius: 24px;
  border: 1px solid rgba(5, 31, 32, 0.06);
  box-shadow: 0 8px 32px rgba(5, 31, 32, 0.08);
  overflow: hidden;
}

/* Header */
.panel-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(5, 31, 32, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(5, 31, 32, 0.02) 0%, transparent 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #DAFDE2 0%, #8CB69B 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(140, 182, 155, 0.2);
}

.bell-icon {
  color: #051F20;
  transition: all 0.3s ease;
}

.bell-icon.has-urgent {
  animation: bellShake 0.5s ease-in-out infinite alternate;
}

@keyframes bellShake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
  animation: badgePulse 2s ease-in-out infinite;
}

.notification-badge.urgent {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #051F20;
  margin: 0 0 0.25rem 0;
}

.header-subtitle {
  font-size: 0.875rem;
  color: rgba(5, 31, 32, 0.6);
  margin: 0;
}

.refresh-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(5, 31, 32, 0.1);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6B7280;
}

.refresh-btn:hover {
  background: rgba(5, 31, 32, 0.02);
  border-color: rgba(5, 31, 32, 0.2);
  color: #051F20;
}

.refresh-btn:active {
  transform: rotate(180deg);
}

/* Loading State */
.loading-state {
  padding: 3rem 2rem;
  text-align: center;
  color: rgba(5, 31, 32, 0.6);
}

.spin-icon {
  animation: spin 1s linear infinite;
  color: #8CB69B;
  margin-bottom: 1rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  padding: 3rem 2rem;
  text-align: center;
}

.success-icon {
  color: #22c55e;
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #051F20;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: rgba(5, 31, 32, 0.6);
  margin: 0;
}

/* Notifications List */
.notifications-list {
  padding: 1rem;
  max-height: 600px;
  overflow-y: auto;
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: rgba(5, 31, 32, 0.02);
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: rgba(140, 182, 155, 0.3);
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: rgba(140, 182, 155, 0.5);
}

/* Notification Groups */
.notification-group {
  margin-bottom: 1.5rem;
}

.notification-group:last-child {
  margin-bottom: 0;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.group-header.urgent {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.group-header.high {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.group-header.normal {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .panel-header {
    padding: 1.25rem 1.5rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
  }

  .header-title {
    font-size: 1.125rem;
  }

  .notifications-list {
    max-height: 400px;
  }
}
</style>
