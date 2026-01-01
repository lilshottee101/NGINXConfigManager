import { deleteCertificate } from '../../utils/certbot.ts';

export const name = 'deleteCertificate';
export const requiresAuth = true;
export const requiredRole = 'admin';

export default async (peer: any, message: any) => {
  const { requestId } = message;
  const { certName } = message.data;

  if (!certName) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Missing required field: certName'
    }));
    return;
  }

  try {
    const result = await deleteCertificate(certName);

    peer.send(JSON.stringify({
      requestId,
      success: result.success,
      error: result.error
    }));
  } catch (err: any) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: err.message
    }));
  }
};
