<template>
  <div class="password-container">
    <div class="password-card">
      <div class="password-header">
        <Shield class="header-icon" :size="48" />
        <h1 class="password-title">Cambiar Contraseña</h1>
        <p class="password-subtitle">
          {{ primerIngreso ? 'Por seguridad, debes cambiar tu contraseña inicial' : 'Actualiza tu contraseña' }}
        </p>
      </div>

      <form @submit.prevent="handleCambiarPassword" class="password-form">
        <div class="form-group">
          <label for="new-password" class="form-label">
            <Lock :size="18" />
            Nueva Contraseña
          </label>
          <div class="password-input-wrapper">
            <input
              id="new-password"
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Mínimo 8 caracteres"
              required
              autocomplete="new-password"
              :disabled="loading"
              @input="validarPassword"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="password-toggle"
              :disabled="loading"
            >
              <Eye v-if="!showNewPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm-password" class="form-label">
            <Lock :size="18" />
            Confirmar Contraseña
          </label>
          <div class="password-input-wrapper">
            <input
              id="confirm-password"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Confirma tu contraseña"
              required
              autocomplete="new-password"
              :disabled="loading"
              @input="validarPassword"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="password-toggle"
              :disabled="loading"
            >
              <Eye v-if="!showConfirmPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <!-- Validación de contraseña -->
        <div class="password-requirements">
          <p class="requirements-title">La contraseña debe cumplir:</p>
          <ul class="requirements-list">
            <li :class="{ valid: validations.length }">
              <Check v-if="validations.length" :size="16" />
              <X v-else :size="16" />
              Mínimo 8 caracteres
            </li>
            <li :class="{ valid: validations.hasUpperCase }">
              <Check v-if="validations.hasUpperCase" :size="16" />
              <X v-else :size="16" />
              Una letra mayúscula
            </li>
            <li :class="{ valid: validations.hasLowerCase }">
              <Check v-if="validations.hasLowerCase" :size="16" />
              <X v-else :size="16" />
              Una letra minúscula
            </li>
            <li :class="{ valid: validations.hasNumber }">
              <Check v-if="validations.hasNumber" :size="16" />
              <X v-else :size="16" />
              Un número
            </li>
            <li :class="{ valid: validations.matches }">
              <Check v-if="validations.matches" :size="16" />
              <X v-else :size="16" />
              Las contraseñas coinciden
            </li>
          </ul>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          <AlertCircle :size="18" />
          {{ errorMessage }}
        </div>

        <!-- Botones -->
        <div class="button-group">
          <button
            type="submit"
            class="btn-primary"
            :disabled="loading || !passwordValid"
          >
            <Loader v-if="loading" class="spinner" :size="20" />
            <Save v-else :size="20" />
            {{ loading ? 'Guardando...' : 'Cambiar Contraseña' }}
          </button>

          <button
            v-if="!primerIngreso"
            type="button"
            @click="$router.push('/dashboard')"
            class="btn-secondary"
            :disabled="loading"
          >
            <ArrowLeft :size="20" />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import { Shield, Lock, Eye, EyeOff, Check, X, AlertCircle, Save, ArrowLeft, Loader } from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()
const { currentUser, cambiarPassword } = useAuth()

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const primerIngreso = ref(false)

const validations = ref({
  length: false,
  hasUpperCase: false,
  hasLowerCase: false,
  hasNumber: false,
  matches: false
})

const passwordValid = computed(() => {
  return Object.values(validations.value).every(v => v === true)
})

const validarPassword = () => {
  const pwd = newPassword.value

  validations.value = {
    length: pwd.length >= 8,
    hasUpperCase: /[A-Z]/.test(pwd),
    hasLowerCase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    matches: pwd === confirmPassword.value && pwd.length > 0
  }
}

const handleCambiarPassword = async () => {
  if (!passwordValid.value) {
    errorMessage.value = 'La contraseña no cumple con los requisitos'
    return
  }

  if (!currentUser.value) {
    toast.error('No hay usuario autenticado')
    router.push('/login')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await cambiarPassword(currentUser.value.id, newPassword.value)

    if (result.success) {
      toast.success('Contraseña cambiada exitosamente')
      router.push('/dashboard')
    } else {
      errorMessage.value = result.error || 'Error al cambiar contraseña'
      toast.error(result.error || 'Error al cambiar contraseña')
    }
  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    errorMessage.value = 'Error inesperado. Intenta nuevamente.'
    toast.error('Error inesperado. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!currentUser.value) {
    toast.error('Debes iniciar sesión primero')
    router.push('/login')
    return
  }

  primerIngreso.value = currentUser.value.primerIngreso || false
})
</script>

<style scoped>
.password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #051f20 0%, #0a3334 50%, #051f20 100%);
  padding: 1rem;
}

.password-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.password-header {
  background: linear-gradient(135deg, #051f20 0%, #0a3334 100%);
  padding: 2.5rem 2rem;
  text-align: center;
  color: white;
}

.header-icon {
  color: #d4af37;
  margin-bottom: 1rem;
}

.password-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.password-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.password-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #051f20;
  margin-bottom: 0.5rem;
}

.form-label svg {
  color: #d4af37;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
  color: #051f20;
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-input:disabled {
  background: #f9fafb;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .form-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #051f20;
}

.password-requirements {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.requirements-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #051f20;
  margin: 0 0 0.75rem 0;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
  padding: 0.375rem 0;
}

.requirements-list li.valid {
  color: #059669;
}

.requirements-list li svg {
  flex-shrink: 0;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-primary {
  color: white;
  background: linear-gradient(135deg, #d4af37 0%, #c4a137 100%);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  color: #051f20;
  background: white;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d4af37;
  color: #d4af37;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .password-card {
    border-radius: 16px;
  }

  .password-header {
    padding: 2rem 1.5rem;
  }

  .password-title {
    font-size: 1.5rem;
  }

  .password-form {
    padding: 1.5rem;
  }
}
</style>
