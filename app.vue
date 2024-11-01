<template>
  <div class="mx-auto max-w-screen-md space-y-6 py-20">
    <div class="text-6xl font-bold tracking-wide">Welcome</div>
    <MessageStack class="h-[500px] py-6" />
    <div class="text-xl font-light tracking-wide text-gray-600">
      Before we launch,<br />
      fuel up with some stellar<br />
      snacks and drinks.
    </div>
  </div>
</template>

<script lang="ts" setup>
const messages = [
  'Hello, world!',
  'Bonjour le monde!',
  'Dirk Sonnemann',
  'Hallo Welt!',
  'Hola Mundo!',
  'Ciao mondo!',
  'こんにちは世界',
]
</script>
