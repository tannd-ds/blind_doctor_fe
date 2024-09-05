const BASE_URL = 'http://localhost:8000'

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
  return await request('/upload-audio', 'POST', formData)
}
