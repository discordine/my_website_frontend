console.log(useRuntimeConfig().oauth)

export default defineOAuthTwitchEventHandler({
  config: {
    scope: ['user:read:email']
  },

  async onSuccess(event, { user }) {
    console.log('SUCCESS')

    await setUserSession(event, {
      user: {
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        profileImage: user.profile_image_url
      }
    })

    return sendRedirect(event, '/calendar')
  },

  onError(event, error) {
    console.error('FULL ERROR:')
    console.dir(error, { depth: null })
    throw error
  }
})