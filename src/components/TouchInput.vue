<template>
  <div class="touch-input-wrapper">
    <label 
      v-if="label" 
      :for="inputId"
      class="touch-input-label"
      :class="{ 'error-label': hasError, 'required-label': required }"
    >
      {{ label }}
      <span v-if="required" class="required-asterisk">*</span>
    </label>
    
    <div class="touch-input-container" :class="{ 'has-icon': hasIcon }">
      <!-- Input Field -->
      <input
        v-if="type !== 'textarea' && type !== 'select'"
        :id="inputId"
        v-model="internalValue"
        :type="inputType"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
        :pattern="pattern"
        :inputmode="inputMode"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
        ref="inputRef"
      />
      
      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        :id="inputId"
        v-model="internalValue"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        ref="inputRef"
      ></textarea>
      
      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :id="inputId"
        v-model="internalValue"
        :class="inputClasses"
        :disabled="disabled"
        @change="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        ref="inputRef"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value || option"
          :value="option.value || option"
        >
          {{ option.label || option }}
        </option>
      </select>
      
      <!-- Icon -->
      <div v-if="hasIcon" class="touch-input-icon">
        <slot name="icon">
          <component 
            v-if="icon" 
            :is="icon" 
            class="w-5 h-5" 
            :class="iconClasses"
          />
        </slot>
      </div>
      
      <!-- Clear Button -->
      <button
        v-if="clearable && internalValue && !disabled"
        @click="clearValue"
        class="touch-input-clear"
        type="button"
        :aria-label="`Clear ${label || 'input'}`"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Error Message -->
    <div 
      v-if="hasError" 
      class="touch-input-error"
      role="alert"
    >
      {{ error }}
    </div>
    
    <!-- Helper Text -->
    <div 
      v-else-if="helper" 
      class="touch-input-helper"
    >
      {{ helper }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search',
      'date', 'datetime-local', 'month', 'time', 'week',
      'textarea', 'select'
    ].includes(value)
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  helper: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [String, Object],
    default: null
  },
  // Number inputs
  min: {
    type: [Number, String],
    default: undefined
  },
  max: {
    type: [Number, String],
    default: undefined
  },
  step: {
    type: [Number, String],
    default: undefined
  },
  // Text inputs
  pattern: {
    type: String,
    default: undefined
  },
  autocomplete: {
    type: String,
    default: undefined
  },
  // Textarea
  rows: {
    type: Number,
    default: 4
  },
  // Select
  options: {
    type: Array,
    default: () => []
  },
  // Touch optimizations
  hapticFeedback: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'keydown', 'clear'])

// Refs
const inputRef = ref(null)
const inputId = ref(`touch-input-${Math.random().toString(36).substr(2, 9)}`)

// Internal value
const internalValue = ref(props.modelValue)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

// Computed
const hasError = computed(() => !!props.error)
const hasIcon = computed(() => !!props.icon || !!$slots.icon)

const inputType = computed(() => {
  if (props.type === 'textarea' || props.type === 'select') return 'text'
  return props.type
})

const inputMode = computed(() => {
  const modes = {
    email: 'email',
    tel: 'tel',
    number: 'numeric',
    search: 'search',
    url: 'url'
  }
  return modes[props.type] || 'text'
})

const inputClasses = computed(() => [
  'touch-input',
  {
    'touch-input--error': hasError.value,
    'touch-input--disabled': props.disabled,
    'touch-input--readonly': props.readonly,
    'touch-input--textarea': props.type === 'textarea',
    'touch-input--select': props.type === 'select'
  }
])

const iconClasses = computed(() => [
  'touch-input-icon-svg',
  {
    'text-red-500': hasError.value,
    'text-gray-400': !hasError.value && (props.disabled || props.readonly),
    'text-gray-600': !hasError.value && !props.disabled && !props.readonly
  }
])

// Methods
const triggerHapticFeedback = (type = 'light') => {
  if (!props.hapticFeedback || !('vibrate' in navigator)) return
  
  const patterns = {
    light: 25,
    medium: 50,
    error: [100, 50]
  }
  
  navigator.vibrate(patterns[type] || patterns.light)
}

const handleInput = (event) => {
  const value = event.target.value
  internalValue.value = value
  emit('update:modelValue', value)
  
  if (props.hapticFeedback) {
    triggerHapticFeedback('light')
  }
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
  
  // Scroll into view on mobile
  if (window.innerWidth < 768) {
    setTimeout(() => {
      if (inputRef.value && document.activeElement === inputRef.value) {
        inputRef.value.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }, 300) // Wait for keyboard to appear
  }
}

const handleKeydown = (event) => {
  emit('keydown', event)
  
  // Enter key handling for better UX
  if (event.key === 'Enter' && props.type !== 'textarea') {
    const form = inputRef.value?.closest('form')
    if (form) {
      const inputs = Array.from(form.querySelectorAll('input, select, textarea'))
      const currentIndex = inputs.indexOf(inputRef.value)
      const nextInput = inputs[currentIndex + 1]
      
      if (nextInput) {
        nextInput.focus()
      } else {
        inputRef.value?.blur()
      }
    }
  }
}

const clearValue = () => {
  internalValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
  triggerHapticFeedback('light')
  
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Expose methods
defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<style scoped>
.touch-input-wrapper {
  @apply w-full;
}

.touch-input-label {
  @apply block text-sm font-semibold text-gray-700 mb-2;
}

.touch-input-label.error-label {
  @apply text-red-600;
}

.required-asterisk {
  @apply text-red-500 ml-1;
}

.touch-input-container {
  @apply relative;
}

.touch-input {
  @apply w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-xl;
  @apply transition-all duration-200 ease-in-out;
  @apply focus:ring-0 focus:border-emerald-500 focus:outline-none;
  @apply placeholder-gray-400;
  min-height: 48px;
  font-size: 16px; /* Prevent zoom on iOS */
}

.touch-input:focus {
  @apply shadow-lg;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  transform: translateY(-1px);
}

.touch-input--error {
  @apply border-red-500 bg-red-50;
}

.touch-input--error:focus {
  @apply border-red-500;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.touch-input--disabled {
  @apply bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed;
}

.touch-input--readonly {
  @apply bg-gray-50 border-gray-200;
}

.touch-input--textarea {
  @apply resize-none;
  min-height: auto;
}

.touch-input--select {
  @apply appearance-none cursor-pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
  padding-right: 40px;
}

.touch-input-icon {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none;
}

.has-icon .touch-input {
  @apply pr-12;
}

.touch-input-clear {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2;
  @apply w-6 h-6 flex items-center justify-center;
  @apply text-gray-400 hover:text-gray-600;
  @apply rounded-full hover:bg-gray-100;
  @apply transition-all duration-200;
  @apply -webkit-tap-highlight-color: transparent;
}

.touch-input-clear:active {
  @apply scale-95;
}

.touch-input-error {
  @apply mt-1 text-sm text-red-600;
}

.touch-input-helper {
  @apply mt-1 text-sm text-gray-500;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .touch-input {
    min-height: 52px;
    @apply px-4 py-4 text-base;
  }
  
  .touch-input--select {
    background-position: right 16px center;
    padding-right: 44px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .touch-input {
    @apply border-black;
  }
  
  .touch-input:focus {
    @apply border-black;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2);
  }
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .touch-input {
    @apply transition-none;
    transform: none !important;
  }
  
  .touch-input:focus {
    transform: none !important;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .touch-input {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
  
  .touch-input:focus {
    -webkit-user-select: text;
    user-select: text;
  }
}
</style>