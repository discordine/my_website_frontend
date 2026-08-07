export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  return await $fetch(`http://127.0.0.1:8000/api/threads/${id}`)
})