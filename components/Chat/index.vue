<script setup>
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { getAnswer, uploadAudio } from "~/utils/apiService.js";

const messages = ref([
  {
    name: 'VIMMCQA',
    message: 'Hi, how can I help you today?',
  },
]);

const sendMessage = async (message) => {
  try {
    const result = await getAnswer(null, message)
    addMessage('VIMMCQA', result.answer)
    console.log(result)
  } catch (error) {
    console.error('Error uploading audio:', error)
    addMessage('VIMMCQA', 'Sorry, I could not process your audio. Please try again.')
    // TODO: only play if user doesn't mute
    await playErrorVoice()
  }
};

const addMessage = (name, message) => {
  messages.value.push({ name, message });
};

const { audioInputs: microphones, } = useDevicesList({ requestPermissions: true, })
const currentMicrophone = computed(() => microphones.value[2]?.deviceId)

const { stream, start } = useUserMedia({ constraints: { audio: { deviceId: currentMicrophone, } } })
start()

const mediaRecorder = ref(null)
const audioChunks = ref([])
const audioURL = ref(null)
const isRecording = ref(false)

const startRecording = () => {
  mediaRecorder.value = new MediaRecorder(stream.value)
  audioChunks.value = []

  mediaRecorder.value.ondataavailable = (event) => {
    audioChunks.value.push(event.data)
  }

  mediaRecorder.value.onstop = async () => {
    const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
    audioURL.value = URL.createObjectURL(audioBlob)

    // const formData = new FormData()
    // formData.append('audio', audioBlob)

    try {
      const result = await uploadAudio(audioBlob)
      console.log(result)
    } catch (error) {
      console.error('Error uploading audio:', error)
      addMessage('VIMMCQA', 'Sorry, I could not process your audio. Please try again.')
      // TODO: only play if user doesn't mute
      await playErrorVoice()
    }
  }

  mediaRecorder.value.start()
  isRecording.value = true
}

// Stop recording audio
const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
  }
}

const toggleMic = () => {
  console.log('Toggling mic')
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}
</script>

<template>
  <div
      style="box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05);"
      class="h-full flex flex-col justify-between bg-white p-6 rounded-lg dark:bg-zinc-900"
  >

    <div>
      <div class="flex flex-col space-y-1.5 pb-6">
        <h2 class="font-semibold text-lg tracking-tight dark:text-zinc-200">VIMMCQA</h2>
        <p class="text-sm text-[#6b7280] leading-3">How many blind doctors do you want? YES</p>
      </div>

      <div class="min-w-full pr-4 flex flex-col gap-1">
        <ChatMessage
            v-for="msg in messages"
            :name="msg.name"
            :message="msg.message"
        />
      </div>
    </div>

    <audio v-if="audioURL" :src="audioURL" controls></audio>

    <ChatInputBar
        @add-message="(message_info) => addMessage(message_info['sender'], message_info['message'])"
        @submit="(message) => sendMessage(message)"
        @toggle-mic="toggleMic"
        :mic-status="isRecording"
    />

  </div>
</template>