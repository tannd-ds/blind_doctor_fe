export default async function () {
  const audio = new Audio('/audio/error_voice.wav')
  await audio.play()
}