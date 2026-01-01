import { unlink, access } from 'node:fs/promises';

export const name = 'deleteSite';
export const requiresAuth = true;
export const requiredRole = 'admin';

export default async (peer: any, message: any) => {
  try {
    const { siteName } = message.data;
    const { requestId } = message;

    if (!siteName) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: 'Missing required field: siteName'
      }));
      return;
    }

    const enabledPath = `/etc/nginx/conf.d/${siteName}.conf`;
    const disabledPath = `/etc/nginx/conf.d/${siteName}.conf.disabled`;

    const enabledExists = await access(enabledPath).then(() => true).catch(() => false);
    const disabledExists = await access(disabledPath).then(() => true).catch(() => false);

    if (!enabledExists && !disabledExists) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: `Site ${siteName} does not exist`
      }));
      return;
    }

    const pathToDelete = enabledExists ? enabledPath : disabledPath;

    try {
      await unlink(pathToDelete);
    } catch (err) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: `Failed to delete config file: ${err.message}`
      }));
      return;
    }

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: `Site ${siteName} deleted successfully`
    }));
  } catch (err) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: `Unexpected error: ${err.message}`
    }));
  }
}
