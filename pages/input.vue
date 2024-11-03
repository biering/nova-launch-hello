<template>
  <div class="mx-auto max-w-screen-md space-y-9 py-20">
    <div class="text-xl font-bold">Add new guest</div>
    <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-6">
      <UFormGroup name="name" label="Name">
        <UInput v-model="state.name" placeholder="Name" />
      </UFormGroup>
      <UFormGroup name="rfidId" label="RFID ID">
        <UInput v-model="state.rfidId" placeholder="RFID ID" />
      </UFormGroup>
      <UButton type="submit" label="Submit" />
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import * as y from 'yup'
import type { InferType } from 'yup'

import type { FormSubmitEvent } from '#ui/types'

const schema = y.object({
  name: y.string().required(),
  rfidId: y.string().required(),
})

type Schema = InferType<typeof schema>

const state = reactive<Schema>({
  name: '',
  rfidId: '',
})

async function onSubmit({ data }: FormSubmitEvent<Schema>) {
  console.log(data)

  // TODO: write to airtable
}
</script>
