<template>
  <div
    class="notification-item"
    :class="[`priority-${notification.priority}`, `color-${notification.color}`]"
    @click="$emit('click')"
  >
    <!-- Icon -->
    <div class="notif-icon" :class="`icon-${notification.color}`">
      <component :is="getIcon(notification.icon)" :size="20" />
    </div>

    <!-- Content -->
    <div class="notif-content">
      <div class="notif-header">
        <span class="notif-title">{{ notification.title }}</span>
        <span v-if="notification.amount" class="notif-amount">
          Q{{ formatNumber(notification.amount) }}
        </span>
      </div>
      <p class="notif-message">{{ notification.message }}</p>
      <div class="notif-footer">
        <span class="notif-detail">{{ notification.detail }}</span>
        <span class="notif-date">{{ formatDate(notification.date) }}</span>
      </div>
    </div>

    <!-- Arrow -->
    <div class="notif-arrow">
      <ChevronRight :size="20" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  AlertCircle,
  Clock,
  Calendar,
  CalendarX,
  ChevronRight
} from 'lucide-vue-next'

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const getIcon = (iconName) => {
  const icons = {
    'alert-circle': AlertCircle,
    'clock': Clock,
    'calendar': Calendar,
    'calendar-x': CalendarX
  }
  return icons[iconName] || AlertCircle
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)
}

const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('es-GT', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 16px;
  background: white;
  border: 1px solid rgba(5, 31, 32, 0.06);
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.notification-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  transition: width 0.3s ease;
}

.notification-item.color-red::before {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
}

.notification-item.color-orange::before {
  background: linear-gradient(180deg, #f97316 0%, #ea580c 100%);
}

.notification-item.color-yellow::before {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.notification-item.color-blue::before {
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
}

.notification-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(5, 31, 32, 0.08);
  border-color: rgba(5, 31, 32, 0.12);
}

.notification-item:hover::before {
  width: 6px;
}

.notification-item:active {
  transform: translateX(2px) scale(0.99);
}

/* Icon */
.notif-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.icon-red {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.icon-orange {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%);
  color: #ea580c;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.icon-yellow {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.icon-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Content */
.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  gap: 0.5rem;
}

.notif-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #051F20;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.notif-amount {
  font-size: 0.875rem;
  font-weight: 700;
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.notif-message {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #051F20;
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notif-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.notif-detail {
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  white-space: nowrap;
}

.color-red .notif-detail {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.color-orange .notif-detail {
  background: rgba(249, 115, 22, 0.1);
  color: #ea580c;
}

.color-yellow .notif-detail {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.color-blue .notif-detail {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.notif-date {
  font-size: 0.8125rem;
  color: rgba(5, 31, 32, 0.5);
  font-weight: 500;
}

/* Arrow */
.notif-arrow {
  color: rgba(5, 31, 32, 0.3);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.notification-item:hover .notif-arrow {
  color: rgba(5, 31, 32, 0.6);
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .notification-item {
    padding: 0.875rem;
  }

  .notif-icon {
    width: 40px;
    height: 40px;
  }

  .notif-message {
    font-size: 0.875rem;
  }

  .notif-footer {
    flex-wrap: wrap;
  }
}
</style>
