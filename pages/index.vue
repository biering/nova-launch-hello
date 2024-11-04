<template>
  <div class="mx-auto max-w-screen-md space-y-6 py-20">
    <div class="text-6xl font-bold tracking-wide">{{ heading }}</div>
    <div class="h-[500px] py-6">
      <MessageStack :simulate="simulate" class="h-full" />
    </div>
    <div class="w-64 text-xl font-light tracking-wide text-gray-600">
      {{ description }}
    </div>
    <UBadge v-if="simulate" class="text-xs tracking-wide" color="red">
      Simulated
    </UBadge>
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
