<script setup>
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { getAnswer, uploadAudio } from "~/utils/apiService.js";

const messages = ref([
  {
    name: 'VIMMCQA',
    message: 'Hi, how can I help you today?',
  },
]);

const recommendedQuestions = ref([]);

const isAnswering = ref(false)

const sendMessage = async (message) => {
  addMessage('You', message)
  isAnswering.value = true
  try {
    const result = await getAnswer(null, message)
    addMessage('VIMMCQA', result.answer)

    if (result.recommended_questions) {
      recommendedQuestions.value = result.recommended_questions
    }
  } catch (error) {
    addMessage('VIMMCQA', 'Sorry, I could not process your audio. Please try again.')
    // TODO: only play if user doesn't mute
    await playErrorVoice()
  }
  isAnswering.value = false
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

    try {
      const result = await getAnswer(audioBlob)
      if (result.transcription)
        addMessage('You', result.transcription)
      addMessage('VIMMCQA', result.answer)
      console.log(result)
    } catch (error) {
      console.error('Error uploading audio:', error)
      addMessage('VIMMCQA', 'Xin lỗi, hiện tại tôi đang không thể xử lý được! Hãy thử lại sau.')
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
      class="h-[97vh] flex flex-col justify-between bg-white p-6 rounded-lg dark:bg-zinc-900"
  >

    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col space-y-1.5 pb-6">
        <h2 class="font-semibold text-lg tracking-tight dark:text-zinc-200">VIMMCQA</h2>
        <p class="text-sm text-[#6b7280] leading-3">Blind Doctor</p>
      </div>

      <div class="min-w-full pr-4 flex flex-col gap-1">
        <ChatMessage
            v-for="msg in messages"
            :name="msg.name"
            :message="msg.message"
        />

        <span v-show="isAnswering" class="flex gap-1 items-center text-sm text-zinc-400">
          <span>Trợ lí cần một ít thời gian để suy nghĩ</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle>
          </svg>
        </span>
      </div>
    </div>

    <div v-if="recommendedQuestions.length > 0" class="py-4 flex flex-col gap-1">
      <div>Câu hỏi gợi ý</div>
      <ChatRecommendedQuestion
          v-for="question in recommendedQuestions" :key="question"
          @click="sendMessage(question)"
      >
        {{ question }}
      </ChatRecommendedQuestion>
    </div>

    <ChatInputBar
        @submit="(message) => sendMessage(message)"
        @toggle-mic="toggleMic"
        :mic-status="isRecording"
    />

  </div>
</template>