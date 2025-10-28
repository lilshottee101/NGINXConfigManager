declare module "crossws" {
  interface PeerContext {
    jwt?: string;
  }
}

declare type wsHandler = (peer: any, message: any) => Promise<void> | void;

declare type HandlerFunction = (peer: any, message: any) => Promise<void> | void;

declare interface HandlerModule {
  name: string;
  default: HandlerFunction;
}
