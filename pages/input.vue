<template>
  <div class="mx-auto max-w-screen-md space-y-9 py-20">
    <div class="text-xl font-bold">Add new guest</div>
    <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-6">
      <div class="space-y-9 sm:flex sm:space-x-3 sm:space-y-0">
        <UFormGroup name="firstname" label="Firstname" class="sm:w-1/2">
          <UInput v-model="state.firstname" placeholder="Firstname" />
        </UFormGroup>
        <UFormGroup name="lastname" label="Lastname" class="sm:w-1/2">
          <UInput v-model="state.lastname" placeholder="Lastname" />
        </UFormGroup>
      </div>
      <UFormGroup name="rfid" label="RFID">
        <UInput id="rfid" v-model="state.rfid" placeholder="RFID" />
      </UFormGroup>
      <div class="space-x-3">
        <UButton type="submit" label="Submit" :loading="pending" />
        <UButton label="Reset" @click="onReset" color="red" />
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import * as y from 'yup'
import type { InferType } from 'yup'

import type { FormSubmitEvent } from '#ui/types'

import useAirtable from '~~/composables/useAirtable'

definePageMeta({
  colorMode: 'light',
})

const { updateGuestRFID } = useAirtable()
const schema = y.object({
  firstname: y.string().required(),
  lastname: y.string().required(),
  rfid: y.string().required(),
})

type Schema = InferType<typeof schema>

const state = reactive<Schema>({
  firstname: '',
  lastname: '',
  rfid: '',
})
const pending = ref<boolean>(false)

async function onSubmit({ data }: FormSubmitEvent<Schema>) {
  console.log(data)
  try {
    pending.value = true
    await updateGuestRFID(data.firstname, data.lastname, data.rfid)
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    pending.value = false
  }
}

function onReset() {
  state.firstname = ''
  state.lastname = ''
  state.rfid = ''
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})

function handleKeyPress(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
      // Blur (remove focus from) any active input element
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && 'blur' in activeElement) {
        if (activeElement.id === 'rfid' && state.rfid.length > 12) {
          state.rfid = state.rfid.slice(-12)
        }
        if (activeElement.id === 'rfid') {
          activeElement.blur()
        }
      }

      return
  }
}
</script>
