import fs from 'node:fs';
import { unlink, access, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

export const name = 'updateSite';
export const requiresAuth = true;
export const requiredRole = 'admin';

async function testNginxConfig(configContent: string): Promise<{ valid: boolean; error?: string }> {
  const datetime = Date.now();
  const tempSiteFile = `/tmp/nginx-test-site-${datetime}.conf`;
  const tempMainFile = `/tmp/nginx-test-main-${datetime}.conf`;

  try {
    // Write the site config to test
    await writeFile(tempSiteFile, configContent, 'utf8');

    // Create a main config file that imports the site config
    const mainConfig = `
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    # Include the test site config
    include ${tempSiteFile};
}
`;
    await writeFile(tempMainFile, mainConfig, 'utf8');

    return new Promise((resolve) => {
      const nginxTest = spawn('nginx', ['-t', '-c', tempMainFile]);

      let stderr = '';

      nginxTest.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      nginxTest.on('close', async (code) => {
        try {
          await rm(tempSiteFile);
          await rm(tempMainFile);
        } catch (err) {
          console.error('Failed to remove temp files:', err);
        }

        if (code === 0) {
          resolve({ valid: true });
        } else {
          resolve({
            valid: false,
            error: stderr || 'Configuration test failed'
          });
        }
      });

      nginxTest.on('error', async (err) => {
        try {
          await rm(tempSiteFile);
          await rm(tempMainFile);
        } catch (rmErr) {
          console.error('Failed to remove temp files:', rmErr);
        }

        resolve({
          valid: false,
          error: `Failed to run nginx test: ${err.message}`
        });
      });
    });
  } catch (err: any) {
    return {
      valid: false,
      error: `Failed to create temp config file: ${err.message}`
    };
  }
}

export default async (peer: any, message: any) => {
  try {
    const { siteName, content, enabled, override } = message.data;
    const { requestId } = message;

    if (!siteName || content === undefined) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: 'Missing required fields: siteName and content'
      }));
      return;
    }

    const enabledPath = `/etc/nginx/conf.d/${siteName}.conf`;
    const disabledPath = `/etc/nginx/conf.d/${siteName}.conf.disabled`;

    if (!override) {
      const testResult = await testNginxConfig(content);

      if (!testResult.valid) {
        peer.send(JSON.stringify({
          requestId,
          success: false,
          error: 'Invalid nginx configuration',
          validationError: testResult.error,
          tested: true
        }));
        return;
      }
    }

    const enabledExists = await access(enabledPath).then(() => true).catch(() => false);
    const disabledExists = await access(disabledPath).then(() => true).catch(() => false);

    const currentPath = enabledExists ? enabledPath : (disabledExists ? disabledPath : null);
    const targetPath = enabled ? enabledPath : disabledPath;

    try {
      fs.writeFileSync(targetPath, content, 'utf8');
    } catch (err) {
      peer.send(JSON.stringify({
        requestId,
        success: false,
        error: `Failed to write config file: ${err.message}`
      }));
      return;
    }

    if (currentPath && currentPath !== targetPath) {
      try {
        await unlink(currentPath);
      } catch (err) {
        peer.send(JSON.stringify({
          requestId,
          success: false,
          error: `Failed to remove old config file: ${err.message}`
        }));
        return;
      }
    }

    peer.send(JSON.stringify({
      requestId,
      success: true,
      message: `Site ${siteName} updated successfully`,
      enabled,
      tested: !override
    }));
  } catch (err) {
    peer.send(JSON.stringify({
      requestId,
      success: false,
      error: `Unexpected error: ${err.message}`
    }));
  }
}
