export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  if (session.user.login !== 'discordine_slack') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Stream ID is required'
    })
  }

  const body = await readBody(event)

  return await $fetch(
    `http://127.0.0.1:8000/api/streams/${id}`,
    {
      method: 'PUT',
      body
    }
  )
})