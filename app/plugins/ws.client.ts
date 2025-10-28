import { useWebSocket } from '@vueuse/core';

function testFunc(ws, event) {
  console.log(event)
}

export default defineNuxtPlugin((nuxtApp) => {
  const websocket = useWebSocket('ws://localhost:3000/_ws', {
    autoReconnect: {
      delay: 1000
    },
    heartbeat: {
      message: 'ping',
      responseMessage: 'pong'
    },
    onDisconnected: testFunc
  });

  return {
    provide: {
      webSocket: websocket
    }
  }

})
