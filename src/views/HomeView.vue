<template>
  <div class="relative w-full h-screen overflow-hidden" :style="backgroundStyle">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center flex-col text-center text-white px-4 z-10">
      <h1 class="text-4xl md:text-6xl font-extrabold text-cyan-400 drop-shadow-md animate-pulse">
        Soluciones Integrales GN
      </h1>
      <p class="text-xl md:text-2xl mt-4 text-blue-200">
        Tenemos un mundo de posibilidades para ti
      </p>
      <router-link
        to="/login"
        class="mt-10 px-10 py-3 bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
      >
        Entrar al sistema
      </router-link>
    </div>
  </div>
</template>

<script setup>
const backgroundStyle = {
  backgroundImage: "url('/assets/futuristic-bg.avif')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}
</script>

<style scoped>
</style>