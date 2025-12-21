import { uploadCustomCertificate } from '../../utils/certbot.ts';

export const name = 'uploadCertificate';

export default async (peer: any, message: any) => {
  const { requestId } = message;
  const { certName, certContent, keyContent, chainContent } = message.data;

  if (!certName || !certContent || !keyContent) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: 'Missing required fields: certName, certContent, and keyContent'
    }));
    return;
  }

  try {
    const result = await uploadCustomCertificate(certName, certContent, keyContent, chainContent);

    peer.send(JSON.stringify({
      requestId,
      success: result.success,
      error: result.error,
      paths: result.paths
    }));
  } catch (err: any) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: err.message
    }));
  }
};
