import fs from 'node:fs';
import { access } from 'node:fs/promises';

export const name = 'createSite';
export const requiresAuth = true;
export const requiredRole = 'admin';

export default async (peer: any, message: any) => {
  try {
    const { siteName, content, enabled } = message.data;
    const { requestId } = message;

    if (!siteName) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: 'Missing required field: siteName'
      }));
      return;
    }

    const extension = enabled ? '.conf' : '.conf.disabled';
    const filePath = `/etc/nginx/conf.d/${siteName}${extension}`;

    // Check if site already exists (either enabled or disabled)
    const enabledExists = await access(`/etc/nginx/conf.d/${siteName}.conf`).then(() => true).catch(() => false);
    const disabledExists = await access(`/etc/nginx/conf.d/${siteName}.conf.disabled`).then(() => true).catch(() => false);

    if (enabledExists || disabledExists) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: `Site ${siteName} already exists`
      }));
      return;
    }

    // Use default config if no content provided
    const defaultConfig = `server {
    listen 80;
    server_name ${siteName};

    location / {
        root /var/www/html;
        index index.html;
    }
}`;

    const configContent = content || defaultConfig;

    try {
      fs.writeFileSync(filePath, configContent, 'utf8');
    } catch (err: any) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: `Failed to create config file: ${err.message}`
      }));
      return;
    }

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: `Site ${siteName} created successfully`,
      enabled
    }));
  } catch (err: any) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: `Unexpected error: ${err.message}`
    }));
  }
};
