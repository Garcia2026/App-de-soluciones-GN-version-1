<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo y Header -->
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-gn">GN</div>
        </div>
        <h1 class="login-title">Sistema Soluciones GN</h1>
        <p class="login-subtitle">Ingresa tus credenciales para continuar</p>
      </div>

      <!-- Formulario de Login -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <User class="icon" :size="18" />
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

        <div class="form-group">
          <label for="password" class="form-label">
            <Lock class="icon" :size="18" />
            Contraseña
          </label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Ingresa tu contraseña"
              required
              autocomplete="current-password"
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
              :disabled="loading"
            >
              <Eye v-if="!showPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          <AlertCircle :size="18" />
          {{ errorMessage }}
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="btn-login"
          :disabled="loading"
        >
          <Loader v-if="loading" class="spinner" :size="20" />
          <LogIn v-else :size="20" />
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <!-- Recuperar Contraseña -->
        <div class="forgot-password">
          <button
            type="button"
            @click="$router.push('/recuperar-password')"
            class="link-button"
            :disabled="loading"
          >
            <Key :size="16" />
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>

      <!-- Footer -->
      <div class="login-footer">
        <p>&copy; {{ new Date().getFullYear() }} Sistema Soluciones GN</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from 'vue-toastification'
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, Key, Loader } from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await login(username.value, password.value)

    if (result.success) {
      toast.success(`¡Bienvenido ${result.user.nombre}!`)

      // Si es primer ingreso, redirigir a cambio de contraseña
      if (result.requiresPasswordChange) {
        toast.info('Por seguridad, debes cambiar tu contraseña')
        router.push('/cambiar-password')
      } else {
        router.push('/dashboard')
      }
    } else {
      errorMessage.value = result.error || 'Error al iniciar sesión'
      toast.error(result.error || 'Error al iniciar sesión')
    }
  } catch (error) {
    console.error('Error en login:', error)
    errorMessage.value = 'Error inesperado. Intenta nuevamente.'
    toast.error('Error inesperado. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #051f20 0%, #0a3334 50%, #051f20 100%);
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #051f20 0%, #0a3334 100%);
  padding: 3rem 2rem;
  text-align: center;
  color: white;
}

.logo-container {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.logo-gn {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  border: 3px solid #d4af37;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #d4af37;
}

.login-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.login-form {
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

.form-label .icon {
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

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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

.btn-login {
  width: 100%;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #d4af37 0%, #c4a137 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  background: linear-gradient(135deg, #e4bf47 0%, #d4af37 100%);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.forgot-password {
  text-align: center;
  margin-top: 1.5rem;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #051f20;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.link-button:hover:not(:disabled) {
  background: #f3f4f6;
  color: #d4af37;
}

.link-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.login-footer {
  background: #f9fafb;
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

.login-footer p {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 640px) {
  .login-card {
    border-radius: 16px;
  }

  .login-header {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .login-form {
    padding: 1.5rem;
  }
}
</style>
