import { createCertificate } from '../../utils/certbot.ts';

export const name = 'createCertificate';

export default async (peer: any, message: any) => {
  const { requestId } = message;
  const { domains, email } = message.data;

  if (!domains || !Array.isArray(domains) || domains.length === 0) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Missing or invalid domains array'
    }));
    return;
  }

  try {
    const result = await createCertificate(domains, email);

    peer.send(JSON.stringify({
      requestId,
      success: result.success,
      error: result.error,
      output: result.output
    }));
  } catch (err: any) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: err.message
    }));
  }
};
