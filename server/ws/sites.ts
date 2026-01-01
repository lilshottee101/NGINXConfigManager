import { readdir } from 'node:fs/promises';
import fs from 'node:fs';

export const name = 'getSites';
export const requiresAuth = true;
export const requiredRole = 'user';

export default async (peer: any, message: any) => {
  const formattedSites = []
  const { requestId } = message;

  const confFiles = await readdir('/etc/nginx/conf.d');

  confFiles.forEach((item) => {
    if (!item.endsWith('.conf') && !item.endsWith('.conf.disabled')) {
      return;
    }

    const fileContents = (() => {
      try {
        return fs.readFileSync(`/etc/nginx/conf.d/${item}`, 'utf8');
      } catch {
        return null;
      }
    })();

    const isEnabled = item.endsWith('.conf');
    const siteName = item.replace(/\.conf(\.disabled)?$/, '');

    formattedSites.push({
      site: siteName,
      active: isEnabled,
      content: fileContents,
    });
  })

  peer.send(JSON.stringify({
    requestId,
    sites: formattedSites
  }));
}

