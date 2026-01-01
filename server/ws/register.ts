import { auth, isAuthDisabled } from '../../utils/auth';

export const name = 'register';
export const requiresAuth = false;

export default async (peer: any, message: any) => {
  const { email, password, name } = message.data;
  const { requestId } = message;

  if (isAuthDisabled) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Registration is disabled when authentication is disabled'
    }));
    return;
  }

  if (!email || !password || !name) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Email, password, and name are required'
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
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name
      }
    });

    if (!result || !result.user) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: 'Registration failed'
      }));
      return;
    }

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: 'Registration successful',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role || 'user'
      }
    }));
  } catch (err: any) {
    console.error('Registration error:', err);
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Registration failed: ' + (err.message || 'Unknown error')
    }));
  }
};
