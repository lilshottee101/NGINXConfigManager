import { auth, isAuthDisabled } from '../../utils/auth';

export const name = 'logout';
export const requiresAuth = false;

export default async (peer: any, message: any) => {
  const { requestId } = message;
  const { token } = message.data;

  if (isAuthDisabled) {
    peer.user = null;
    peer.authenticated = false;

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: 'Logged out (auth disabled mode)'
    }));
    return;
  }

  if (!auth) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Authentication is not configured'
    }));
    return;
  }

  try {
    if (token) {
      await auth.api.signOut({
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    }

    peer.user = null;
    peer.authenticated = false;

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: 'Logged out successfully'
    }));
  } catch (err: any) {
    console.error('Logout error:', err);

    peer.user = null;
    peer.authenticated = false;

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: 'Logged out'
    }));
  }
};
