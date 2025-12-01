import { readdir } from 'node:fs/promises';
import fs from 'node:fs';

export const name = 'getSites'

export default async (peer: any, message: any) => {
  const formattedSites = []
  const { requestId } = message;

  const availableSites = await readdir('/etc/nginx/sites-available');
  const enabledSites = await readdir('/etc/nginx/sites-enabled');

  availableSites.forEach((item) => {
    const fileContents = (() => {
      try {
        return fs.readFileSync(`/etc/nginx/sites-available/${item}`, 'utf8');
      } catch {
        return null;
      }
    })();

    formattedSites.push({
      site: item,
      active: enabledSites.includes(item),
      content: fileContents,
    });
  })

  peer.send(JSON.stringify({
    requestId,
    sites: formattedSites
  }));
}

