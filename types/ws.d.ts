declare module "crossws" {
  interface PeerContext {
    jwt?: string;
    user?: any;
    authenticated?: boolean;
  }
}

declare type wsHandler = (peer: any, message: any) => Promise<void> | void;

declare type HandlerFunction = (peer: any, message: any) => Promise<void> | void;

declare interface HandlerModule {
  name: string;
  default: HandlerFunction;
  requiresAuth?: boolean;
  requiredRole?: 'admin' | 'user';
  requiredPermission?: string;
}
