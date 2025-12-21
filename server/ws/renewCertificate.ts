import { renewCertificate } from '../../utils/certbot.ts';

export const name = 'renewCertificate';

export default async (peer: any, message: any) => {
  const { requestId } = message;
  const { certName } = message.data;

  try {
    const result = await renewCertificate(certName);

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
