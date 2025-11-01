<template>
  <SafeComponentWrapper>
    <ExpensesTracker />
  </SafeComponentWrapper>
</template>

<script setup>
import SafeComponentWrapper from '../components/SafeComponentWrapper.vue'
import ExpensesTracker from './ExpensesTracker.vue'
</script>