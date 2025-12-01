import { useWebSocket } from '@vueuse/core';
import { useSitesStore } from '~/stores/sitesStore'
import { handleNginxApiResponse } from '~/composables/useNginxApi'

function onDisconnect(ws, event) {
  console.log('WebSocket disconnected:', event)
}

export default defineNuxtPlugin((nuxtApp) => {

  const sitesStore = useSitesStore()
  function msgHandler(ws, event) {
    console.log('WebSocket message received:', event.data)

    try {
      const responseData = JSON.parse(event.data)

      // First, try to handle as API response with requestId
      const wasHandled = handleNginxApiResponse(responseData)

      if (wasHandled) {
        console.log('Response handled by API handler')
        return
      }

      // If not handled, check if it's a sites list update (legacy array format or new object format)
      if (Array.isArray(responseData)) {
        sitesStore.setSites(responseData)
        console.log('Sites updated in store (array format):', sitesStore.sites)
      } else if (responseData.sites && Array.isArray(responseData.sites)) {
        sitesStore.setSites(responseData.sites)
        console.log('Sites updated in store (object format):', sitesStore.sites)
      } else {
        console.log('Unhandled message type:', responseData)
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }
  const websocket = useWebSocket('ws://localhost:3000/_ws', {
    autoReconnect: {
      delay: 1000
    },
    heartbeat: {
      message: 'ping',
      responseMessage: 'pong'
    },
    onMessage: msgHandler,
    onDisconnected: onDisconnect
  });

  return {
    provide: {
      webSocket: websocket
    }
  }

})
