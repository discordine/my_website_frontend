import type { FetchError } from 'ofetch'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()

  // check if the header token is correct
  const auth = getHeader(event, 'authorization')
  if (auth !== `Bearer ${config.authSecret}`) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  console.log('Received stream data:', body)

    try {
    await $fetch('http://127.0.0.1:8000/api/streams', {
        method: 'POST',
        body
    })
    } catch (e) {
        const err = e as FetchError
        console.error(err.data)
        console.error(err.statusCode)
    }

  console.log('Stream data sent to API:', body)

  return { success: true }
})