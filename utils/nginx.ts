import { spawnSync, spawn, ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import { access } from 'node:fs/promises';
import type { nginxSignals, nginxInfoDictionary } from "../types/nginx.d.ts";

function sendSignal(signal: nginxSignals): ChildProcess {
  const command = spawnSync('nginx', ['-s', signal]);
  return command;
}

function testTempConfig(config: string): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const datetime = new Date().getTime();
    const filename = `/tmp/nginx-${datetime}.config`;

    fs.writeFile(filename, config, (err) => {
      if (err) {
        reject(new Error("Failed to write temp config file"));
        return;
      }

      const command = spawn('nginx', ['-tq', `-c`, filename]);

      command.on('close', (code) => {
        fs.rm(filename, (rmErr) => {
          if (rmErr) {
            console.error('Failed to remove temp file:', rmErr);
          }
        });
        resolve(command);
      });
    });
  });
}

function testConfig(suppressNonError: Boolean, configPath?: string): ChildProcess {
  const commandArg = suppressNonError ? '-tq' : '-t';
  const configArg = configPath ? `-c ${configPath}` : '';
  const command = spawn('nginx', [commandArg, configArg]);
  return command;
}

function getInfo(): nginxInfoDictionary {
  const command: ChildProcess = spawnSync('nginx', ['-V']);
  const rawArray: Array<string> = command.output[2].toString('utf8').split("\n")
  const infoDict: nginxInfoDictionary = {
    nginxVersion: rawArray[0],
    builtWith: rawArray[1],
    tlsSniSupport: rawArray[2].endsWith("enabled"),
    arguments: rawArray[3].split(" ")
  }
  return infoDict;
}

async function enableSite(siteName: string): Promise<void> {
  const disabledPath = `/etc/nginx/conf.d/${siteName}.conf.disabled`;
  const enabledPath = `/etc/nginx/conf.d/${siteName}.conf`;

  const disabledExists = await access(disabledPath).then(() => true).catch(() => false);
  const enabledExists = await access(enabledPath).then(() => true).catch(() => false);

  if (!disabledExists && !enabledExists) {
    throw new Error(`Site ${siteName} does not exist in conf.d`);
  }

  if (enabledExists) {
    return;
  }

  const fs = await import('node:fs/promises');
  await fs.rename(disabledPath, enabledPath);
}

async function disableSite(siteName: string): Promise<void> {
  const enabledPath = `/etc/nginx/conf.d/${siteName}.conf`;
  const disabledPath = `/etc/nginx/conf.d/${siteName}.conf.disabled`;

  const exists = await access(enabledPath).then(() => true).catch(() => false);
  if (!exists) {
    return;
  }

  const fs = await import('node:fs/promises');
  await fs.rename(enabledPath, disabledPath);
}

async function isSiteEnabled(siteName: string): Promise<boolean> {
  const enabledPath = `/etc/nginx/conf.d/${siteName}.conf`;
  return await access(enabledPath).then(() => true).catch(() => false);
}

export {
  sendSignal,
  testConfig,
  testTempConfig,
  getInfo,
  enableSite,
  disableSite,
  isSiteEnabled
};
