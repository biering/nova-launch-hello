<template>
  <div class="mx-auto max-w-screen-md space-y-6 py-20">
    <div class="text-6xl font-bold tracking-wide">Welcome</div>
    <div class="h-[500px] py-6">
      <MessageStack :simulate="simulate" class="h-full" />
    </div>
    <div class="text-xl font-light tracking-wide text-gray-600">
      Before we launch,<br />
      fuel up with some stellar<br />
      snacks and drinks.
    </div>
    <UBadge v-if="simulate" class="text-xs tracking-wide" color="red">
      Simulated
    </UBadge>
  </div>
</template>

<script lang="ts" setup>
const simulate = ref<boolean>(true)
</script>
