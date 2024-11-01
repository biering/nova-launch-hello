<template>
  <div class="flex">
    <transition-group
      name="message"
      tag="div"
      class="message-container space-y-6"
    >
      <div
        v-for="(message, index) in messages"
        :key="message.id"
        class="message-item"
        :class="[getOpacity(index)]"
      >
        <WelcomeMessage :message="message.name" />
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import useAirtable from '~~/composables/useAirtable'
import type { GuestData } from '~~/types'

const { downloadGuestlist } = useAirtable()
const messages = ref<{ id: number; name: string }[]>([])
const maxMessages = ref(5) // Adjust this value to set the number of displayed messages
const useWebsocket = false
const mockGuests = ref<string[]>([
  'John Doe',
  'Christian Piechnick',
  'Christoph Biering',
  'Dirk Sonnemann',
  'Bill Gates',
  'Steve Jobs',
  'Elon Musk',
  'Jeff Bezos',
  'Mark Zuckerberg',
  'Tim Cook',
  'Satya Nadella',
  'Sundar Pichai',
  'Larry Page',
  'Sergey Brin',
  'Jack Dorsey',
  'Reed Hastings',
  'Brian Chesky',
  'Travis Kalanick',
  'Dara Khosrowshahi',
  'Daniel Ek',
  'Stewart Butterfield',
  'Evan Spiegel',
  'Bobby Murphy',
  'The Rock',
  'Tom Cruise',
  'Will Smith',
  'Brad Pitt',
  'Leonardo DiCaprio',
  'Johnny Depp',
  'Robert Downey Jr.',
  'Chris Hemsworth',
  'Chris Evans',
  'Chris Pratt',
  'Chris Pine',
  'Chris Rock',
  'Chris Tucker',
])

let websocket: WebSocket

const { data: fetchedGuestlist } = await useAsyncData(() => downloadGuestlist())

const guestlist = computed<GuestData[]>(() => {
  if (!fetchedGuestlist.value) return []
  return fetchedGuestlist.value
})

function getOpacity(index: number) {
  switch (index) {
    case 0:
      return 'opacity-100'
    case 1:
      return 'opacity-100'
    case 2:
      return 'opacity-100'
    case 3:
      return 'opacity-80'
    case 4:
      return 'opacity-60'
    default:
      return 'opacity-40'
  }
}

onMounted(async () => {
  websocket = new WebSocket('ws://172.31.10.215:8765')

  if (useWebsocket) {
    websocket.onmessage = (event) => {
      console.log(event)
      const id = event.data.trim()
      // Find guest by RFID
      const guest = guestlist.value.find((g) => g.RFID === id)
      if (guest) {
        const messageId = Date.now() + Math.random()
        messages.value.unshift({
          id: messageId,
          name: `${guest.firstname} ${guest.lastname}`,
        })

        if (messages.value.length > maxMessages.value) {
          setTimeout(() => {
            messages.value.pop()
          }, 500)
        }
      } else {
        console.warn(`Guest with RFID ${id} not found.`)
      }
    }
  } else {
    // Simulate adding a new message every X seconds
    const interval = 2000 // Interval in milliseconds (e.g., 2000ms = 2 seconds)

    setInterval(() => {
      // Randomly select a guest from the mock data
      const randomGuest =
        mockGuests.value[Math.floor(Math.random() * mockGuests.value.length)]
      const messageId = Date.now() + Math.random() // Unique ID for each message

      // Add a new message to the beginning of the messages array
      messages.value.unshift({ id: messageId, name: `${randomGuest}` })

      // If messages exceed maxMessages, remove the last one
      if (messages.value.length > maxMessages.value) {
        // Remove the last message with a slight delay to allow the transition
        setTimeout(() => {
          messages.value.pop()
        }, 500) // Delay matches the leave transition duration
      }
    }, interval)
  }
})

onBeforeUnmount(() => {
  if (websocket) {
    websocket.close()
  }
})
</script>

<style scoped>
/* Tailwind CSS styles */
.message-container {
  @apply flex flex-col;
}

/* Transition styles using Tailwind */
.message-enter-active,
.message-leave-active,
.message-move {
  @apply transition-all duration-1000 ease-in-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.message-enter-to {
  opacity: 1;
  transform: translateY(0);
  transform: translateX(0);
}

.message-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.message-leave-to {
  opacity: 0;
}
</style>
