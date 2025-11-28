import { useWebSocket } from '@vueuse/core';
import { useSitesStore } from '~/stores/sitesStore'


function onDisconnect(ws, event) {
  console.log(event)
}

function getSites(ws, event) {
  const request = {
    request: "getSites"
  }
  const sites = ws.send(JSON.stringify(request));
}

export default defineNuxtPlugin((nuxtApp) => {

  const sitesStore = useSitesStore()
  function msgHandler(ws, event) {
    console.log(event.data)

    try {
      const sitesData = JSON.parse(event.data)

      if (Array.isArray(sitesData)) {
        sitesStore.setSites(sitesData)
        console.log('Sites updated in store:', sitesStore.sites)
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
