import type { wsHandler } from '../types/ws.d.ts';
import fs from 'fs';
import path from 'path';

export class wsHandlerLoader {
  private handlers: Map<string, wsHandler>;
  private directory: string;

  constructor(directory: string) {
    this.handlers = new Map();
    this.directory = directory;
  }

  async loadHandlers() {
    const files = fs.readdirSync(this.directory).filter(f => f.endsWith('.ts'));

    for (const file of files) {
      const handlerPath = path.join(this.directory, file);
      const handler = await import(handlerPath);

      // Only except valid handlers.
      if (!handler.name || typeof handler.default !== 'function') {
        console.warn(`Ignoring ${file} does not export name and function.`)
        continue;
      }

      this.handlers.set(handler.name, handler.default);
    }
    console.log(`Loaded ${this.handlers.size} WS Handlers`);
  }

  async handle(peer, message) {
    const request = message.request;
    const handler = this.handlers.get(request);

    if (!handler) {
      console.warn(`WS Request: ${request} not found`);
      peer.send("RequestNotFound")
    }

    try {
      await handler(peer, message);
    } catch (err) {
      console.error(`Error in handler "${request}":`, err);
    }
  }
}
