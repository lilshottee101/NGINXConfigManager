import type { HandlerFunction } from "./ws";

declare module "nitropack" {
  interface NitroApp {
    wsHandlers: {
      handle: (peer: any, message: any) => Promise<void>;
      reload: () => Promise<void>;
      list: () => string[];
    };
  }
}
