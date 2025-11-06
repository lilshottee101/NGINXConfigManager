import { readdir } from 'node:fs/promises';
export const name = 'getSites'

export default async (peer: any, message: any) => {

  var formattedSites = []

  var availableSites = await readdir('/etc/nginx/sites-available');
  var enabledSites = await readdir('/etc/nginx/sites-enabled');

  availableSites.forEach((item) => {

    formattedSites.push({
      site: item,
      active: enabledSites.includes(item),
    });
  })

  peer.send(JSON.stringify(formattedSites));
}

