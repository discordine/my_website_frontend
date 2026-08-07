export const useStreams = () => {
  const config = useRuntimeConfig()

  const baseURL = config.public.apiBase

  // 一覧取得
  const getStreams = async () => {
    return await $fetch(`${baseURL}/streams`)
  }

  // 詳細取得
  const getStream = async (id) => {
    return await $fetch(`${baseURL}/streams/${id}`)
  }

  // 作成
  const createStream = async (payload) => {
    return await $fetch(`${baseURL}/streams`, {
      method: 'POST',
      body: payload
    })
  }

  // 更新
  const updateStream = async (id, payload) => {
    return await $fetch(`${baseURL}/streams/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  // 削除
  const deleteStream = async (id) => {
    return await $fetch(`${baseURL}/streams/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getStreams,
    getStream,
    createStream,
    updateStream,
    deleteStream
  }
}