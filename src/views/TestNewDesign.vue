<template>
  <MainLayout>
    <template #header-actions>
      <button class="btn-gold">
        + Nueva Acción
      </button>
    </template>
    
    <div class="test-dashboard">
      <div class="welcome-section">
        <div class="professional-card">
          <h2 class="welcome-title">¡Bienvenido al Nuevo Diseño!</h2>
          <p class="welcome-text">
            Este es el nuevo layout profesional inspirado en apps de flight booking.
            Mantenemos todas las funcionalidades pero con un diseño más limpio y corporativo.
          </p>
        </div>
      </div>

      <div class="cards-grid">
        <!-- Card estilo flight booking 1 -->
        <div class="professional-card flight-card">
          <div class="flight-header">
            <div class="airline-info">
              <div class="airline-logo">GN</div>
              <div class="flight-details">
                <h3>Don Eduardo</h3>
                <p class="flight-time">Saldo Actual</p>
              </div>
            </div>
            <div class="price">
              <span class="amount">Q61,035.55</span>
              <button class="btn-gold-small">Gestionar</button>
            </div>
          </div>
        </div>

        <!-- Card estilo flight booking 2 -->
        <div class="professional-card flight-card">
          <div class="flight-header">
            <div class="airline-info">
              <div class="airline-logo prestamo">PR</div>
              <div class="flight-details">
                <h3>Préstamo Principal</h3>
                <p class="flight-time">10/36 Cuotas</p>
              </div>
            </div>
            <div class="price">
              <span class="amount">Q3,700</span>
              <button class="btn-gold-small">Pagar</button>
            </div>
          </div>
        </div>

        <!-- Card estilo flight booking 3 -->
        <div class="professional-card flight-card">
          <div class="flight-header">
            <div class="airline-info">
              <div class="airline-logo ganancia">GA</div>
              <div class="flight-details">
                <h3>Ganancia Mensual</h3>
                <p class="flight-time">Diciembre 2025</p>
              </div>
            </div>
            <div class="price">
              <span class="amount">Q2,000</span>
              <button class="btn-gold-small">Pagar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de estadísticas -->
      <div class="stats-section">
        <div class="professional-card stats-card">
          <h3 class="stats-title">Estadísticas del Mes</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">Q15,420</div>
              <div class="stat-label">Ingresos</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">Q8,340</div>
              <div class="stat-label">Gastos</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">Q7,080</div>
              <div class="stat-label">Ganancia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
</script>

<style scoped>
.test-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  space-y: 2rem;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #051F20;
  margin: 0 0 1rem 0;
}

.welcome-text {
  color: #6B7280;
  line-height: 1.6;
  margin: 0;
}

/* === FLIGHT BOOKING STYLE CARDS === */
.cards-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.flight-card {
  padding: 1.5rem;
}

.flight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.airline-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.airline-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #051F20;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}

.airline-logo.prestamo {
  background: #235347;
}

.airline-logo.ganancia {
  background: #D4AF37;
  color: #051F20;
}

.flight-details h3 {
  font-weight: 600;
  color: #051F20;
  margin: 0;
  font-size: 1rem;
}

.flight-time {
  color: #6B7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.price {
  text-align: right;
}

.amount {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #051F20;
  margin-bottom: 0.5rem;
}

.btn-gold-small {
  background: #D4AF37;
  color: #051F20;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-gold-small:hover {
  background: #B8941F;
  transform: translateY(-1px);
}

/* === STATS SECTION === */
.stats-section {
  margin-bottom: 2rem;
}

.stats-card {
  padding: 2rem;
}

.stats-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #051F20;
  margin: 0 0 1.5rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #051F20;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6B7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
}
</style>