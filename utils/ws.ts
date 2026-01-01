import type { wsHandler, HandlerModule } from '../types/ws.d.ts';
import fs from 'fs';
import path from 'path';
import { isAuthDisabled } from './auth';

export class wsHandlerLoader {
  private handlers: Map<string, HandlerModule>;
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

      this.handlers.set(handler.name, handler);
    }
    console.log(`Loaded ${this.handlers.size} WS Handlers`);
  }

  async handle(peer, message) {
    const request = message.request;
    const handlerModule = this.handlers.get(request);

    if (!handlerModule) {
      console.warn(`WS Request: ${request} not found`);
      peer.send(JSON.stringify({
        requestId: message.requestId,
        success: false,
        error: 'Request not found'
      }));
      return;
    }

    if (!isAuthDisabled && handlerModule.requiresAuth && !peer.authenticated) {
      peer.send(JSON.stringify({
        requestId: message.requestId,
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      }));
      return;
    }

    if (!isAuthDisabled && handlerModule.requiredRole && peer.user?.role !== handlerModule.requiredRole) {
      if (!(handlerModule.requiredRole === 'user' && peer.user?.role === 'admin')) {
        peer.send(JSON.stringify({
          requestId: message.requestId,
          success: false,
          error: `Insufficient permissions. Required role: ${handlerModule.requiredRole}`,
          code: 'INSUFFICIENT_PERMISSIONS'
        }));
        return;
      }
    }

    try {
      await handlerModule.default(peer, message);
    } catch (err) {
      console.error(`Error in handler "${request}":`, err);
      peer.send(JSON.stringify({
        requestId: message.requestId,
        success: false,
        error: 'Internal server error'
      }));
    }
  }
}

export const wsHandler = new wsHandlerLoader(path.resolve('server/ws'))
