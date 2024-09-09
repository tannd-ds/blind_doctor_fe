const BASE_URL = 'http://127.0.0.1:8000'

const request = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {}
  }

  if (body) {
    options.body = body
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    if (!response.ok) {
      throw new Error('API request failed')
    }
    return await response.json()
  } catch (error) {
    console.error('Error during API call:', error)
    throw error
  }
}

export async function uploadAudio(audioBlob) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.wav')
  return await request('/question-answering', 'POST', formData)
}

export async function getAnswer(audioBlob, question) {
  // only audio or question can be sent
  const formData = new FormData()
  if (audioBlob) {
    formData.append('audio', audioBlob, 'recording.wav')
  } else if (question) {
    formData.append('text', question)
  } else {
    throw new Error('Either audio or question must be provided')
  }

  return await request('/question-answering', 'POST', formData)
}