import fs from 'fs';
import path from 'path';
import { defineNitroPlugin } from 'nitropack/runtime';
import type { wsHandler } from '../../types/ws';

export default defineNitroPlugin(async (nitroApp) => {
  const handlers = new Map<string, HandlerFunction>();
  const handlersDir = path.resolve('server/ws/handlers');

  const loadHandlers = async () => {
    handlers.clear();
    const files = fs.readdirSync(this.directory).filter(f => f.endsWith('.ts'));

    for (const file of files) {
      const handlerPath = path.join(handlersDir, file);
      const handler = await import(handlerPath);

      // Only except valid handlers.
      if (!handler.name || typeof handler.default !== 'function') {
        console.warn(`Ignoring ${file} does not export name and function.`)
        continue;
      }

      handlers.set(handler.name, handler.default);
    }
    console.log(`Loaded ${handlers.size} WS Handlers`);
  }

  const handle = async (peer: any, message: any) => {
    const request = message.request;
    const handler = handlers.get(request);

    if (!handler) {
      console.warn(`WS Request: ${request} not found`);
      peer.send("RequestNotFound");
    }

    try {
      await handler(peer, message);
    } catch (err) {
      console.error(`Error in handler "${request}":`, err);
    }
  }

  nitroApp.wsHandlers = {
    handle,
    reload: loadHandlers,
    list: () => Array.from(handlers.keys())
  }
});
