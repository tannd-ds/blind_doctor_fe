<script setup>
  const props = defineProps({
    name: String,
    message: String,
  })
</script>

<template>
    <div class="flex gap-3 my-4 text-gray-600 text-sm flex-1 items-center">
      <span class="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
        <div class="rounded-full bg-gray-100 border p-1">
          <slot name="avatar">
            <svg v-if="props.name=='VIMMCQA'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="m6.173 13.004l.17.371a8.7 8.7 0 0 0 3.3 3.638l.265.155a.181.181 0 0 1 0 .316a8.7 8.7 0 0 0-3.565 3.793l-.17.372a.19.19 0 0 1-.346 0l-.17-.372a8.7 8.7 0 0 0-3.565-3.793a.181.181 0 0 1 0-.316l.265-.155a8.7 8.7 0 0 0 3.3-3.638l.17-.371a.19.19 0 0 1 .346 0M15.078 2.73a15.2 15.2 0 0 0 6.536 7.288a.317.317 0 0 1 0 .553a15.2 15.2 0 0 0-6.536 7.289a.331.331 0 0 1-.605 0a15.2 15.2 0 0 0-6.536-7.289a.317.317 0 0 1 0-.553a15.2 15.2 0 0 0 6.536-7.288a.331.331 0 0 1 .605 0"/></g>
            </svg>
            <svg v-else stroke="none" fill="black" stroke-width="0" viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"> </path>
            </svg>
          </slot>
        </div>
      </span>
      <p class="leading-relaxed">
        <span class="block font-bold text-gray-700">{{props.name}}</span>
        <span>{{props.message}}</span>
      </p>
    </div>
</template>

<style scoped>
</style>