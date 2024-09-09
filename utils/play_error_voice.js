export default async function () {
  const audio = new Audio('/audio/error_voice.mp3')
  await audio.play()
}