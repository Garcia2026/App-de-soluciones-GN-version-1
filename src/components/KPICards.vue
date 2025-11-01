<template>
  <div class="kpi-cards-grid">
    <!-- Total Pendientes -->
    <div class="kpi-card urgent-card" @click="$emit('navigate', '/cobros')">
      <div class="kpi-header">
        <div class="kpi-icon urgent">
          <AlertCircle :size="24" />
        </div>
        <div class="kpi-trend negative">
          <TrendingDown :size="16" />
          <span>{{ urgentCount }}</span>
        </div>
      </div>
      <div class="kpi-content">
        <h3 class="kpi-value urgent-value">{{ urgentCount }}</h3>
        <p class="kpi-label">Tareas Urgentes</p>
        <div class="kpi-detail">
          <Clock :size="14" />
          <span>Requieren atención inmediata</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span class="kpi-link">Ver detalles</span>
        <ChevronRight :size="16" />
      </div>
    </div>

    <!-- Pagos Atrasados -->
    <div class="kpi-card danger-card" @click="$emit('navigate', '/cobros')">
      <div class="kpi-header">
        <div class="kpi-icon danger">
          <DollarSign :size="24" />
        </div>
        <div class="kpi-trend" :class="overdueAmount > 0 ? 'negative' : 'neutral'">
          <span>Q{{ formatNumber(overdueAmount) }}</span>
        </div>
      </div>
      <div class="kpi-content">
        <h3 class="kpi-value danger-value">{{ overdueCount }}</h3>
        <p class="kpi-label">Pagos Atrasados</p>
        <div class="kpi-detail">
          <AlertTriangle :size="14" />
          <span>Vencidos</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span class="kpi-link">Gestionar pagos</span>
        <ChevronRight :size="16" />
      </div>
    </div>

    <!-- Próximos Pagos -->
    <div class="kpi-card warning-card" @click="$emit('navigate', '/cobros')">
      <div class="kpi-header">
        <div class="kpi-icon warning">
          <Calendar :size="24" />
        </div>
        <div class="kpi-trend warning">
          <Clock :size="16" />
          <span>7 días</span>
        </div>
      </div>
      <div class="kpi-content">
        <h3 class="kpi-value warning-value">{{ upcomingCount }}</h3>
        <p class="kpi-label">Pagos Próximos</p>
        <div class="kpi-detail">
          <Calendar :size="14" />
          <span>Q{{ formatNumber(upcomingAmount) }}</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span class="kpi-link">Ver cronograma</span>
        <ChevronRight :size="16" />
      </div>
    </div>

    <!-- Cronograma Tiendas -->
    <div class="kpi-card info-card" @click="$emit('navigate', '/tiendas')">
      <div class="kpi-header">
        <div class="kpi-icon info">
          <Store :size="24" />
        </div>
        <div class="kpi-trend info">
          <Activity :size="16" />
          <span>{{ scheduleProgressPercent }}%</span>
        </div>
      </div>
      <div class="kpi-content">
        <h3 class="kpi-value info-value">{{ scheduleCount }}</h3>
        <p class="kpi-label">Actividades Programadas</p>
        <div class="kpi-detail">
          <CheckCircle :size="14" />
          <span>{{ scheduleCompletedCount }} completadas</span>
        </div>
      </div>
      <div class="kpi-footer">
        <span class="kpi-link">Ver cronogramas</span>
        <ChevronRight :size="16" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  AlertCircle,
  DollarSign,
  Calendar,
  Store,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingDown,
  ChevronRight
} from 'lucide-vue-next'

const props = defineProps({
  urgentCount: { type: Number, default: 0 },
  overdueCount: { type: Number, default: 0 },
  overdueAmount: { type: Number, default: 0 },
  upcomingCount: { type: Number, default: 0 },
  upcomingAmount: { type: Number, default: 0 },
  scheduleCount: { type: Number, default: 0 },
  scheduleCompletedCount: { type: Number, default: 0 }
})

defineEmits(['navigate'])

const scheduleProgressPercent = computed(() => {
  if (props.scheduleCount === 0) return 0
  return Math.round((props.scheduleCompletedCount / props.scheduleCount) * 100)
})

const formatNumber = (number) => {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)
}
</script>

<style scoped>
.kpi-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* KPI Card Base */
.kpi-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(5, 31, 32, 0.06);
  box-shadow: 0 4px 16px rgba(5, 31, 32, 0.06);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0.8;
  transition: height 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(5, 31, 32, 0.12);
}

.kpi-card:hover::before {
  height: 6px;
}

.urgent-card::before {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.danger-card::before {
  background: linear-gradient(90deg, #f97316 0%, #ea580c 100%);
}

.warning-card::before {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.info-card::before {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

/* Header */
.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kpi-icon.urgent {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.kpi-icon.danger {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%);
  color: #ea580c;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.kpi-icon.warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.kpi-icon.info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 700;
}

.kpi-trend.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.kpi-trend.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.kpi-trend.info {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.kpi-trend.neutral {
  background: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

/* Content */
.kpi-content {
  margin-bottom: 1rem;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.urgent-value {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.danger-value {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.warning-value {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-value {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.kpi-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #051F20;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.kpi-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(5, 31, 32, 0.6);
  font-weight: 500;
}

/* Footer */
.kpi-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid rgba(5, 31, 32, 0.06);
}

.kpi-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(5, 31, 32, 0.6);
  transition: color 0.3s ease;
}

.kpi-card:hover .kpi-link {
  color: #051F20;
}

.kpi-footer svg {
  color: rgba(5, 31, 32, 0.3);
  transition: all 0.3s ease;
}

.kpi-card:hover .kpi-footer svg {
  color: rgba(5, 31, 32, 0.6);
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .kpi-cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .kpi-card {
    padding: 1.25rem;
  }

  .kpi-value {
    font-size: 2rem;
  }

  .kpi-icon {
    width: 48px;
    height: 48px;
  }
}
</style>
