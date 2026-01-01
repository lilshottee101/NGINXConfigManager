import { getCertificateConfig } from '../../utils/certbot.ts';

export const name = 'getCertificateConfig';
export const requiresAuth = true;
export const requiredRole = 'user';

export default async (peer: any, message: any) => {
  const { requestId } = message;
  const { certName, serverName } = message.data;

  if (!certName) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Missing required field: certName'
    }));
    return;
  }

  try {
    const config = getCertificateConfig(certName, serverName);

    peer.send(JSON.stringify({
      requestId,
      success: true,
      config
    }));
  } catch (err: any) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: err.message
    }));
  }
};
