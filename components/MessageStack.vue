<template>
  <div class="flex">
    <transition-group
      name="message"
      tag="div"
      class="message-container space-y-6"
      @after-leave="removeMessage"
    >
      <div
        v-for="(message, index) in messages.filter((m) => m.visible)"
        :key="message.id"
        class="message-item"
        :class="[getOpacity(index)]"
        :data-id="message.id"
      >
        <WelcomeMessage :message="message.name" />
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import useAirtable from '~~/composables/useAirtable'
import type { GuestData } from '~~/types'

type Message = {
  id: number
  name: string
  visible: boolean
}

interface Props {
  simulate: boolean
}

const props = defineProps<Props>()

const { downloadGuestlist } = useAirtable()
const messages = ref<Message[]>([])
const maxMessages = ref(7)
const messageQueue = ref<string[]>([])
let processingQueue = false
const mockGuests = ref<string[]>([
  'John Doe',
  'Christian Piechnick',
  'Christoph Biering',
  'Dirk Sonnemann',
  'Margot Robbie',
  'Scarlett Johansson',
  'Jennifer Lawrence',
  'Emma Stone',
  'Natalie Portman',
  'Angelina Jolie',
  'Meryl Streep',
  'Nicole Kidman',
  'Charlize Theron',
  'Cate Blanchett',
  'Julianne Moore',
  'Kate Winslet',
  'Helen Mirren',
  'Viola Davis',
  'Sandra Bullock',
  'Anne Hathaway',
  'Jessica Chastain',
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
      return 'opacity-90'
    case 4:
      return 'opacity-80'
    case 5:
      return 'opacity-70'
    case 5:
      return 'opacity-60'
    default:
      return 'opacity-40'
  }
}

function receiveMessage(name: string, lifetime = 60000) {
  const messageId = Date.now() + Math.random()
  const message = {
    id: messageId,
    name: name,
    visible: true,
  }
  messages.value.unshift(message)

  setTimeout(() => {
    const msg = messages.value.find((m) => m.id === messageId)
    if (msg) msg.visible = false
  }, lifetime)

  // If messages exceed maxMessages, remove the last message with a slight delay to allow the transition
  if (messages.value.length > maxMessages.value) {
    setTimeout(() => {
      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg) lastMsg.visible = false
    }, 500)
  }
}

function removeMessage(el: Element) {
  const messageId = parseFloat(el.getAttribute('data-id') || '')
  const index = messages.value.findIndex((m) => m.id === messageId)
  if (index !== -1) {
    messages.value.splice(index, 1)
  }
}

async function processQueue() {
  if (processingQueue) return
  processingQueue = true

  while (messageQueue.value.length > 0) {
    const name = messageQueue.value.shift()!
    receiveMessage(name)
    // Wait for at least 300ms before processing the next message
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  processingQueue = false
}

function simulateMessages() {
  function sendRandomMessage() {
    const randomGuest =
      mockGuests.value[Math.floor(Math.random() * mockGuests.value.length)]
    // Enqueue the message
    messageQueue.value.push(randomGuest)
    processQueue()

    // Schedule the next message at a random interval between 0.5 and 5 seconds
    const randomInterval = Math.floor(Math.random() * 4500) + 500
    setTimeout(sendRandomMessage, randomInterval)
  }
  sendRandomMessage()
}

onMounted(async () => {
  if (!props.simulate) {
    websocket = new WebSocket('ws://localhost:8765')
    websocket.onmessage = (event) => {
      console.log(event)
      const id = event.data.trim()
      // Find guest by RFID
      const guest = guestlist.value.find((g) => g.RFID === id)
      if (guest) {
        messageQueue.value.push(`${guest.firstname} ${guest.lastname}`)
        processQueue()
      } else {
        console.warn(`Guest with RFID ${id} not found.`)
      }
    }
  } else {
    // Simulate receiving messages at random intervals
    simulateMessages()
  }
})

onBeforeUnmount(() => {
  websocket?.close()
})
</script>

<style scoped>
.message-container {
  @apply flex flex-col;
}

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
  transform: translateX(0);
}

.message-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
