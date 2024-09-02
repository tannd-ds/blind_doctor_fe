<script setup>
const messages = ref([
  {
    name: 'VIMMCQA',
    message: 'Hi, how can I help you today?',
  },
]);

function addMessage(name, message) {
  messages.value.push({ name, message });
}


</script>

<template>
  <div
      style="box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05);"
      class="h-full flex flex-col justify-between bg-white p-6 rounded-lg border border-[#e5e7eb]"
  >

    <div>
      <div class="flex flex-col space-y-1.5 pb-6">
        <h2 class="font-semibold text-lg tracking-tight">VIMMCQA</h2>
        <p class="text-sm text-[#6b7280] leading-3">How many blind doctors do you want? YES</p>
      </div>

      <div
          class="min-w-full pr-4 flex flex-col gap-1"
      >
        <ChatMessage
            v-for="msg in messages"
            :name="msg.name"
            :message="msg.message"
        />
      </div>
    </div>
    <ChatInputBar @add-message="(message_info) => addMessage(message_info['sender'], message_info['message'])" />

  </div>
</template>