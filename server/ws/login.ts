import { auth, isAuthDisabled, defaultUser } from '../../utils/auth.ts';

export const name = 'login';
export const requiresAuth = false;

export default async (peer: any, message: any) => {
  const { email, password } = message.data;
  const { requestId } = message;

  if (isAuthDisabled) {
    peer.user = defaultUser;
    peer.authenticated = true;

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: 'Authentication disabled, using default user',
      user: {
        id: defaultUser.id,
        name: defaultUser.name,
        email: defaultUser.email,
        role: defaultUser.role
      }
    }));
    return;
  }

  if (!email || !password) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Email and password are required'
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
    const result = await auth.api.signInEmail({
      body: {
        email,
        password
      }
    });

    if (!result || !result.user || !result.session) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: 'Invalid credentials'
      }));
      return;
    }

    peer.user = result.user;
    peer.authenticated = true;

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: 'Login successful',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role || 'user'
      },
      session: {
        token: result.session.token,
        expiresAt: result.session.expiresAt
      }
    }));
  } catch (err: any) {
    console.error('Login error:', err);
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Login failed: ' + (err.message || 'Unknown error')
    }));
  }
};
