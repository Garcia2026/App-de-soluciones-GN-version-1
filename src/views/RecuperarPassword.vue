<template>
  <div class="recovery-container">
    <div class="recovery-card">
      <div class="recovery-header">
        <Key class="header-icon" :size="48" />
        <h1 class="recovery-title">Recuperar Contraseña</h1>
        <p class="recovery-subtitle">
          {{ step === 1 ? 'Ingresa tu usuario para recibir un código' : 'Ingresa el código y tu nueva contraseña' }}
        </p>
      </div>

      <!-- PASO 1: Solicitar código -->
      <form v-if="step === 1" @submit.prevent="handleSolicitarCodigo" class="recovery-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <User :size="18" />
            Usuario
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="Ingresa tu usuario"
            required
            autocomplete="username"
            :disabled="loading"
          />
        </div>

        <!-- Info del código -->
        <div class="info-box">
          <Mail :size="20" />
          <div>
            <p class="info-title">Código de Recuperación</p>
            <p class="info-text">
              Se generará un código de 6 dígitos que será enviado a
              <strong>solucionesintegralesgn@gmail.com</strong>
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          <AlertCircle :size="18" />
          {{ errorMessage }}
        </div>

        <div class="button-group">
          <button
            type="submit"
            class="btn-primary"
            :disabled="loading"
          >
            <Loader v-if="loading" class="spinner" :size="20" />
            <Send v-else :size="20" />
            {{ loading ? 'Generando...' : 'Generar Código' }}
          </button>

          <button
            type="button"
            @click="$router.push('/login')"
            class="btn-secondary"
            :disabled="loading"
          >
            <ArrowLeft :size="20" />
            Volver al Login
          </button>
        </div>
      </form>

      <!-- PASO 2: Ingresar código y nueva contraseña -->
      <form v-else @submit.prevent="handleRecuperar" class="recovery-form">
        <!-- Mostrar código generado (en producción se enviaría por email) -->
        <div class="success-box">
          <CheckCircle :size="20" />
          <div>
            <p class="success-title">Código generado exitosamente</p>
            <p class="success-text">
              Tu código es: <strong class="codigo-display">{{ codigoGenerado }}</strong>
            </p>
            <p class="success-subtext">
              (En producción, este código se enviará a solucionesintegralesgn@gmail.com)
            </p>
          </div>
        </div>

        <div class="form-group">
          <label for="codigo" class="form-label">
            <Shield :size="18" />
            Código de Recuperación
          </label>
          <input
            id="codigo"
            v-model="codigo"
            type="text"
            class="form-input"
            placeholder="Ingresa el código de 6 dígitos"
            required
            maxlength="6"
            pattern="[0-9]{6}"
            :disabled="loading"
          />
        </div>

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
          <ul class="requirements-list">
            <li :class="{ valid: validations.length }">
              <Check v-if="validations.length" :size="16" />
              <X v-else :size="16" />
              Mínimo 8 caracteres
            </li>
            <li :class="{ valid: validations.hasUpperCase }">
              <Check v-if="validations.hasUpperCase" :size="16" />
              <X v-else :size="16" />
              Una mayúscula
            </li>
            <li :class="{ valid: validations.hasLowerCase }">
              <Check v-if="validations.hasLowerCase" :size="16" />
              <X v-else :size="16" />
              Una minúscula
            </li>
            <li :class="{ valid: validations.hasNumber }">
              <Check v-if="validations.hasNumber" :size="16" />
              <X v-else :size="16" />
              Un número
            </li>
            <li :class="{ valid: validations.matches }">
              <Check v-if="validations.matches" :size="16" />
              <X v-else :size="16" />
              Contraseñas coinciden
            </li>
          </ul>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          <AlertCircle :size="18" />
          {{ errorMessage }}
        </div>

        <div class="button-group">
          <button
            type="submit"
            class="btn-primary"
            :disabled="loading || !passwordValid"
          >
            <Loader v-if="loading" class="spinner" :size="20" />
            <CheckCircle v-else :size="20" />
            {{ loading ? 'Recuperando...' : 'Recuperar Contraseña' }}
          </button>

          <button
            type="button"
            @click="resetForm"
            class="btn-secondary"
            :disabled="loading"
          >
            <ArrowLeft :size="20" />
            Volver
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import {
  Key, User, Mail, Shield, Lock, Eye, EyeOff, Check, X,
  AlertCircle, Send, CheckCircle, ArrowLeft, Loader
} from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()
const { solicitarCodigoRecuperacion, recuperarPassword } = useAuth()

const step = ref(1)
const username = ref('')
const codigo = ref('')
const codigoGenerado = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

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

const handleSolicitarCodigo = async () => {
  if (!username.value) {
    errorMessage.value = 'Por favor ingresa tu usuario'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await solicitarCodigoRecuperacion(username.value)

    if (result.success) {
      codigoGenerado.value = result.codigo
      step.value = 2
      toast.success('Código generado exitosamente')
      toast.info(`Código: ${result.codigo}`, { timeout: 10000 })
    } else {
      errorMessage.value = result.error || 'Error al generar código'
      toast.error(result.error || 'Error al generar código')
    }
  } catch (error) {
    console.error('Error solicitando código:', error)
    errorMessage.value = 'Error inesperado. Intenta nuevamente.'
    toast.error('Error inesperado. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

const handleRecuperar = async () => {
  if (!codigo.value || !passwordValid.value) {
    errorMessage.value = 'Por favor completa todos los campos correctamente'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await recuperarPassword(username.value, codigo.value, newPassword.value)

    if (result.success) {
      toast.success('Contraseña recuperada exitosamente')
      router.push('/login')
    } else {
      errorMessage.value = result.error || 'Error al recuperar contraseña'
      toast.error(result.error || 'Error al recuperar contraseña')
    }
  } catch (error) {
    console.error('Error recuperando contraseña:', error)
    errorMessage.value = 'Error inesperado. Intenta nuevamente.'
    toast.error('Error inesperado. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  step.value = 1
  codigo.value = ''
  codigoGenerado.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
  validations.value = {
    length: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    matches: false
  }
}
</script>

<style scoped>
.recovery-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #051f20 0%, #0a3334 50%, #051f20 100%);
  padding: 1rem;
}

.recovery-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.recovery-header {
  background: linear-gradient(135deg, #051f20 0%, #0a3334 100%);
  padding: 2.5rem 2rem;
  text-align: center;
  color: white;
}

.header-icon {
  color: #d4af37;
  margin-bottom: 1rem;
}

.recovery-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.recovery-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.recovery-form {
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

.info-box,
.success-box {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.info-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.success-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.info-box svg,
.success-box svg {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-title,
.success-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0 0 0.25rem 0;
}

.info-text,
.success-text {
  font-size: 0.85rem;
  margin: 0;
}

.success-subtext {
  font-size: 0.75rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.8;
}

.codigo-display {
  font-size: 1.25rem;
  font-family: monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #86efac;
}

.password-requirements {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #6b7280;
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
  .recovery-card {
    border-radius: 16px;
  }

  .recovery-header {
    padding: 2rem 1.5rem;
  }

  .recovery-title {
    font-size: 1.5rem;
  }

  .recovery-form {
    padding: 1.5rem;
  }

  .requirements-list {
    grid-template-columns: 1fr;
  }
}
</style>
