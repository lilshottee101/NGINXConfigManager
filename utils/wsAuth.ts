export interface AuthenticatedPeer {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  authenticated: boolean;
  send: (data: string) => void;
}

export function isAuthenticated(peer: any): boolean {
  return peer.authenticated === true && peer.user != null;
}

export function isAdmin(peer: any): boolean {
  return isAuthenticated(peer) && peer.user?.role === 'admin';
}

export function isUser(peer: any): boolean {
  return isAuthenticated(peer) && (peer.user?.role === 'user' || peer.user?.role === 'admin');
}

export function getUser(peer: any): any {
  return isAuthenticated(peer) ? peer.user : null;
}

export function sendUnauthorizedError(peer: any, requestId?: string) {
  peer.send(JSON.stringify({
    requestId,
    success: false,
    error: 'Unauthorized',
    code: 'UNAUTHORIZED'
  }));
}

export function sendInsufficientPermissionsError(peer: any, requestId?: string, requiredRole?: string) {
  peer.send(JSON.stringify({
    requestId,
    success: false,
    error: requiredRole ? `Insufficient permissions. Required role: ${requiredRole}` : 'Insufficient permissions',
    code: 'INSUFFICIENT_PERMISSIONS'
  }));
}
