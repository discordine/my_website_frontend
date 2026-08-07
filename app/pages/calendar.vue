<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid/index.js'
import interactionPlugin from '@fullcalendar/interaction/index.js'
import StreamDetailModal from '~/components/StreamDetailModal.vue'

/**
 * state
 */
const events = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const showModal = ref(false)
const selectedStream = ref<any>(null)
const modalLoading = ref(false)

/**
 * session
 */
const { user, clear: clearSession } = useUserSession()

/**
 * calendar options
 */
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: events.value,
  eventClick: handleEventClick,
  eventDisplay: 'block',
  height: 'auto',
}))

/**
 * fetch streams
 */
const fetchStreams = async () => {
  try {
    loading.value = true
    error.value = null

    const data = await $fetch('/api/streams')

    events.value = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      start: item.started_at?.replace(' ', 'T'),
      end: item.ended_at?.replace(' ', 'T'),
    }))
  } catch (e) {
    console.error(e)
    error.value = '配信データの取得に失敗しました'
  } finally {
    loading.value = false
  }
}

/**
 * event click
 */
const handleEventClick = async (arg: any) => {
  try {
    showModal.value = true
    modalLoading.value = true

    selectedStream.value = await $fetch(`/api/streams/${arg.event.id}`)
  } catch (e) {
    console.error(e)
    alert('詳細取得失敗')
    showModal.value = false
  } finally {
    modalLoading.value = false
  }
}

/**
 * update memo
 */
const updateMemo = async ({ id, memo }: any) => {
  try {
    selectedStream.value = await $fetch(`/api/streams/${id}`, {
      method: 'PUT',
      body: { memo },
    })
  } catch (e) {
    console.error(e)
    alert('保存に失敗しました')
  }
}

/**
 * delete stream
 */
const deleteStream = async (id: number) => {
  try {
    await $fetch(`/api/streams/${id}`, { method: 'DELETE' })

    events.value = events.value.filter(e => e.id !== id)
    showModal.value = false
  } catch (e) {
    console.error(e)
    alert('削除に失敗しました')
  }
}

/**
 * auth
 */
const loginWithTwitch = async () => {
  await navigateTo('/auth/twitch', { external: true })
}

const logout = async () => {
  await clearSession()
}

/**
 * lifecycle
 */
onMounted(fetchStreams)
</script>

<template>
  <title>配信カレンダー</title>
  <div class="min-h-screen bg-gray-50">

    <!-- header -->
    <div class="flex items-center justify-end gap-3 p-4">
      <button
        v-if="!user"
        @click="loginWithTwitch"
        class="rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow
               transition hover:bg-purple-700 active:scale-95"
      >
        Twitch でログイン
      </button>

      <button
        v-else
        @click="logout"
        class="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow
               transition hover:bg-gray-100 active:scale-95"
      >
        ログアウト
      </button>
    </div>

    <!-- title -->
    <div class="mb-6 text-center">
      <h1 class="text-3xl font-bold tracking-wide text-gray-800">
        配信カレンダー
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        過去の配信の記録
      </p>
    </div>

    <!-- loading -->
    <div v-if="loading" class="flex h-[500px] items-center justify-center">
      <p class="text-gray-500 animate-pulse">読み込み中...</p>
    </div>

    <!-- error -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <!-- calendar -->
    <div v-else class="mx-auto max-w-6xl px-4">
      <div class="rounded-2xl border bg-white p-4 shadow-lg">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>

    <!-- modal -->
    <StreamDetailModal
      :show="showModal"
      :loading="modalLoading"
      :stream="selectedStream"
      @close="showModal = false"
      @save="updateMemo"
      @delete="deleteStream"
    />

  </div>
</template>