import { wsHandler } from '../../utils/ws.ts';

async function initHandlers() {
  await wsHandler.loadHandlers();
}

initHandlers();

export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open");
  },

  async message(peer, message) {
    if (message.toString('utf8') === 'ping') {
      peer.send('pong');
    } else {
      const Jmessage = JSON.parse(message)
      await wsHandler.handle(peer, Jmessage);
    }
  },

  close(peer, event) {
    console.log("[ws] close");
  },

  error(peer, error) {
    console.log("[ws] error");
  },
});

