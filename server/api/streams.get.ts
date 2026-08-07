export default defineEventHandler(async () => {
  console.log('GET streams called')

  const data = await $fetch('http://127.0.0.1:8000/api/streams')

  console.log('Laravel returned:', data)

  return data
})