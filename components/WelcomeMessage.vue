<template>
  <div class="font-light tracking-wide text-[#8E56FC]">
    {{ message }}
  </div>
</template>

<script lang="ts" setup>
interface Props {
  message: string
}

defineProps<Props>()
</script>
