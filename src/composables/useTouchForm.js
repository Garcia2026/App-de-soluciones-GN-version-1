/**
 * Composable para optimizar formularios para interfaces táctiles
 * Incluye validación, autocompletado, y optimizaciones UX móviles
 */
import { ref, computed, nextTick } from 'vue'

export function useTouchForm(initialData = {}, options = {}) {
  const config = {
    hapticFeedback: true,
    autoSave: false,
    autoSaveDelay: 2000,
    validateOnChange: false,
    validateOnBlur: true,
    touchOptimized: true,
    autoFocus: false,
    ...options
  }

  // Estado del formulario
  const formData = ref({ ...initialData })
  const errors = ref({})
  const touched = ref({})
  const isSubmitting = ref(false)
  const isDirty = ref(false)
  const isValid = ref(true)

  // Auto save
  let autoSaveTimer = null

  // Validaciones
  const validators = ref(config.validators || {})

  // Feedback háptico
  const triggerHapticFeedback = (type = 'light') => {
    if (!config.hapticFeedback || !('vibrate' in navigator)) return
    
    const patterns = {
      light: 25,
      medium: 50,
      heavy: [50, 50],
      error: [100, 50, 100],
      success: [25, 25, 25]
    }
    
    navigator.vibrate(patterns[type] || patterns.light)
  }

  // Validar campo individual
  const validateField = (fieldName) => {
    const value = formData.value[fieldName]
    const fieldValidators = validators.value[fieldName]
    
    if (!fieldValidators) return true
    
    errors.value[fieldName] = ''
    
    for (const validator of fieldValidators) {
      const result = validator(value)
      if (result !== true) {
        errors.value[fieldName] = result
        return false
      }
    }
    
    return true
  }

  // Validar todo el formulario
  const validateForm = () => {
    let formIsValid = true
    
    Object.keys(validators.value).forEach(fieldName => {
      const fieldValid = validateField(fieldName)
      if (!fieldValid) formIsValid = false
    })
    
    isValid.value = formIsValid
    return formIsValid
  }

  // Manejar cambios en campos
  const updateField = (fieldName, value) => {
    formData.value[fieldName] = value
    touched.value[fieldName] = true
    isDirty.value = true
    
    // Feedback háptico sutil
    triggerHapticFeedback('light')
    
    // Validación en cambio
    if (config.validateOnChange) {
      validateField(fieldName)
    }
    
    // Auto save
    if (config.autoSave) {
      clearTimeout(autoSaveTimer)
      autoSaveTimer = setTimeout(() => {
        if (config.onAutoSave) {
          config.onAutoSave(formData.value)
        }
      }, config.autoSaveDelay)
    }
  }

  // Manejar blur de campos
  const handleFieldBlur = (fieldName) => {
    touched.value[fieldName] = true
    
    if (config.validateOnBlur) {
      validateField(fieldName)
    }
  }

  // Manejar focus de campos
  const handleFieldFocus = (fieldName) => {
    // Limpiar error previo
    if (errors.value[fieldName]) {
      errors.value[fieldName] = ''
    }
  }

  // Submit del formulario
  const handleSubmit = async (customHandler) => {
    if (isSubmitting.value) return false
    
    isSubmitting.value = true
    
    // Validar formulario completo
    const formIsValid = validateForm()
    
    if (!formIsValid) {
      isSubmitting.value = false
      triggerHapticFeedback('error')
      
      // Scroll al primer error
      await nextTick()
      const firstErrorField = document.querySelector('.error-field')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
        firstErrorField.focus()
      }
      
      return false
    }
    
    try {
      const handler = customHandler || config.onSubmit
      if (handler) {
        await handler(formData.value)
        triggerHapticFeedback('success')
      }
      return true
    } catch (error) {
      triggerHapticFeedback('error')
      if (config.onError) {
        config.onError(error)
      }
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // Reset formulario
  const resetForm = () => {
    formData.value = { ...initialData }
    errors.value = {}
    touched.value = {}
    isDirty.value = false
    isValid.value = true
    isSubmitting.value = false
    
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }
  }

  // Computed properties
  const hasErrors = computed(() => {
    return Object.values(errors.value).some(error => error !== '')
  })

  const touchedFields = computed(() => {
    return Object.keys(touched.value).filter(key => touched.value[key])
  })

  // Utilidades para campos específicos
  const getFieldProps = (fieldName, type = 'text') => {
    const baseProps = {
      value: formData.value[fieldName] || '',
      class: [
        'touch-optimized-input',
        {
          'error-field': errors.value[fieldName] && touched.value[fieldName],
          'success-field': touched.value[fieldName] && !errors.value[fieldName]
        }
      ],
      onInput: (e) => updateField(fieldName, e.target.value),
      onBlur: () => handleFieldBlur(fieldName),
      onFocus: () => handleFieldFocus(fieldName)
    }

    // Optimizaciones específicas por tipo
    switch (type) {
      case 'number':
      case 'tel':
        baseProps.inputMode = 'numeric'
        baseProps.pattern = '[0-9]*'
        break
      case 'email':
        baseProps.inputMode = 'email'
        baseProps.autocomplete = 'email'
        break
      case 'search':
        baseProps.inputMode = 'search'
        break
    }

    return baseProps
  }

  const getSelectProps = (fieldName) => {
    return {
      value: formData.value[fieldName] || '',
      class: [
        'touch-optimized-select',
        {
          'error-field': errors.value[fieldName] && touched.value[fieldName],
          'success-field': touched.value[fieldName] && !errors.value[fieldName]
        }
      ],
      onChange: (e) => updateField(fieldName, e.target.value),
      onBlur: () => handleFieldBlur(fieldName),
      onFocus: () => handleFieldFocus(fieldName)
    }
  }

  const getTextareaProps = (fieldName) => {
    return {
      value: formData.value[fieldName] || '',
      class: [
        'touch-optimized-textarea',
        {
          'error-field': errors.value[fieldName] && touched.value[fieldName],
          'success-field': touched.value[fieldName] && !errors.value[fieldName]
        }
      ],
      onInput: (e) => updateField(fieldName, e.target.value),
      onBlur: () => handleFieldBlur(fieldName),
      onFocus: () => handleFieldFocus(fieldName),
      rows: 4
    }
  }

  // CSS helpers
  const getFieldError = (fieldName) => {
    return touched.value[fieldName] ? errors.value[fieldName] : ''
  }

  const isFieldValid = (fieldName) => {
    return touched.value[fieldName] && !errors.value[fieldName]
  }

  const isFieldInvalid = (fieldName) => {
    return touched.value[fieldName] && errors.value[fieldName]
  }

  return {
    // Estado
    formData,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    hasErrors,
    touchedFields,

    // Métodos principales
    updateField,
    handleSubmit,
    resetForm,
    validateForm,
    validateField,

    // Props helpers
    getFieldProps,
    getSelectProps,
    getTextareaProps,

    // Utilidades
    getFieldError,
    isFieldValid,
    isFieldInvalid,
    triggerHapticFeedback,

    // Event handlers
    handleFieldBlur,
    handleFieldFocus
  }
}

// Validadores comunes
export const validators = {
  required: (message = 'Este campo es requerido') => (value) => {
    return value && value.toString().trim() !== '' ? true : message
  },
  
  email: (message = 'Email inválido') => (value) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? true : message
  },
  
  phone: (message = 'Teléfono inválido') => (value) => {
    if (!value) return true
    const phoneRegex = /^\d{4}-?\d{4}$/
    return phoneRegex.test(value.replace(/\s/g, '')) ? true : message
  },
  
  minLength: (min, message) => (value) => {
    if (!value) return true
    return value.length >= min ? true : message || `Mínimo ${min} caracteres`
  },
  
  maxLength: (max, message) => (value) => {
    if (!value) return true
    return value.length <= max ? true : message || `Máximo ${max} caracteres`
  },
  
  number: (message = 'Debe ser un número válido') => (value) => {
    if (!value) return true
    return !isNaN(value) && !isNaN(parseFloat(value)) ? true : message
  },
  
  positiveNumber: (message = 'Debe ser un número positivo') => (value) => {
    if (!value) return true
    const num = parseFloat(value)
    return !isNaN(num) && num > 0 ? true : message
  }
}

// CSS que debería ser agregado globalmente
export const touchFormStyles = `
/* Estilos base para formularios optimizados para touch */
.touch-optimized-input,
.touch-optimized-select,
.touch-optimized-textarea {
  min-height: 48px;
  padding: 12px 16px;
  font-size: 16px; /* Previene zoom en iOS */
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

.touch-optimized-input:focus,
.touch-optimized-select:focus,
.touch-optimized-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  transform: translateY(-1px);
}

.touch-optimized-input.error-field,
.touch-optimized-select.error-field,
.touch-optimized-textarea.error-field {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.touch-optimized-input.success-field,
.touch-optimized-select.success-field,
.touch-optimized-textarea.success-field {
  border-color: #10b981;
  background-color: #f0fdf4;
}

/* Optimizaciones específicas para móviles */
@media (max-width: 768px) {
  .touch-optimized-input,
  .touch-optimized-select,
  .touch-optimized-textarea {
    min-height: 52px;
    font-size: 16px;
    padding: 14px 18px;
  }
}

/* Estilos para botones touch */
.touch-optimized-button {
  min-height: 48px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.touch-optimized-button:active {
  transform: translateY(1px) scale(0.98);
}

@media (max-width: 768px) {
  .touch-optimized-button {
    min-height: 52px;
    padding: 14px 28px;
    font-size: 16px;
  }
}
`