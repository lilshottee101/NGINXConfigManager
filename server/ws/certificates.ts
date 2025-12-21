import { listCertificates } from '../../utils/certbot.ts';

export const name = 'getCertificates';

export default async (peer: any, message: any) => {
  const { requestId } = message;

  try {
    const certificates = await listCertificates();

    peer.send(JSON.stringify({
      requestId,
      success: true,
      certificates
    }));
  } catch (err: any) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: err.message
    }));
  }
};
