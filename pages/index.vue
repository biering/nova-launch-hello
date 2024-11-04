<template>
  <div class="mx-auto max-w-screen-md space-y-6 py-20 text-white text-9xl flex flex-col h-screen">
    <div class="font-bold text-white tracking-wide flex-none">{{ heading }}</div>
    <div class="grow py-6">
      <MessageStack :simulate="simulate" class="h-full" />
    </div>
    <div class="w-72 text-4xl font-light tracking-wide text-gray-400 flex-none">
      {{ description }}
    </div>
    <div class="flex">
      <UBadge v-if="simulate" class="text-xs tracking-wide" color="red">
        Simulated
      </UBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  colorMode: 'light',
})

const simulate = ref<boolean>(true)
const mode = ref<'welcome' | 'comingBack'>('comingBack')

const heading = computed(() => {
  return mode.value === 'welcome' ? 'Welcome' : 'Did you like it?'
})

const description = computed(() => {
  return mode.value === 'welcome'
    ? 'Before we launch, fuel up with some stellar snacks and drinks.'
    : "Don't forget your goodie bag."
})
</script>
