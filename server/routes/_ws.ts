import { wsHandler } from '../../utils/ws.ts';
import { validateSession, isAuthDisabled, defaultUser } from '../../utils/auth';

async function initHandlers() {
  await wsHandler.loadHandlers();
}

initHandlers();

export default defineWebSocketHandler({
  async upgrade(request) {
    // Check for authorization during upgrade
    const authHeader = request.headers.get('authorization');

    if (isAuthDisabled) {
      return {
        user: defaultUser,
        authenticated: true
      };
    }

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { user } = await validateSession(token);

      if (user) {
        return {
          user,
          authenticated: true
        };
      }
    }

    return {
      user: null,
      authenticated: false
    };
  },

  open(peer) {
    console.log("[ws] open", peer.authenticated ? `(user: ${peer.user?.email})` : "(unauthenticated)");
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

