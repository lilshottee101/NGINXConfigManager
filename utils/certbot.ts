import { spawn, spawnSync } from 'node:child_process';
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

interface CertificateInfo {
  name: string;
  domains: string[];
  expiry: string;
  certPath: string;
  keyPath: string;
  chainPath: string;
  fullchainPath: string;
  valid: boolean;
  daysUntilExpiry?: number;
}

async function listCertificates(): Promise<CertificateInfo[]> {
  return new Promise((resolve, reject) => {
    const certbot = spawn('certbot', ['certificates']);
    let stdout = '';
    let stderr = '';

    certbot.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    certbot.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    certbot.on('close', async (code) => {
      if (code !== 0) {
        reject(new Error(`Certbot command failed: ${stderr}`));
        return;
      }

      try {
        const certificates = parseCertbotOutput(stdout);
        resolve(certificates);
      } catch (err) {
        reject(err);
      }
    });

    certbot.on('error', (err) => {
      reject(new Error(`Failed to run certbot: ${err.message}`));
    });
  });
}

function parseCertbotOutput(output: string): CertificateInfo[] {
  const certificates: CertificateInfo[] = [];
  const certBlocks = output.split('Certificate Name:').slice(1);

  for (const block of certBlocks) {
    const lines = block.trim().split('\n');
    const name = lines[0].trim();

    const domainsLine = lines.find(l => l.includes('Domains:'));
    const expiryLine = lines.find(l => l.includes('Expiry Date:'));
    const certPathLine = lines.find(l => l.includes('Certificate Path:'));
    const keyPathLine = lines.find(l => l.includes('Private Key Path:'));

    if (!name || !domainsLine || !expiryLine || !certPathLine || !keyPathLine) {
      continue;
    }

    const domains = domainsLine.split('Domains:')[1].trim().split(' ');
    const expiryMatch = expiryLine.match(/Expiry Date: ([^\(]+)/);
    const expiry = expiryMatch ? expiryMatch[1].trim() : '';

    const daysMatch = expiryLine.match(/\(VALID: (\d+) days\)/);
    const daysUntilExpiry = daysMatch ? parseInt(daysMatch[1]) : undefined;
    const valid = daysUntilExpiry !== undefined && daysUntilExpiry > 0;

    const certPath = certPathLine.split('Certificate Path:')[1].trim();
    const keyPath = keyPathLine.split('Private Key Path:')[1].trim();

    const baseDir = certPath.substring(0, certPath.lastIndexOf('/'));
    const chainPath = join(baseDir, 'chain.pem');
    const fullchainPath = join(baseDir, 'fullchain.pem');

    certificates.push({
      name,
      domains,
      expiry,
      certPath,
      keyPath,
      chainPath,
      fullchainPath,
      valid,
      daysUntilExpiry
    });
  }

  return certificates;
}

function createCertificate(domains: string[], email?: string): Promise<{ success: boolean; error?: string; output?: string }> {
  return new Promise((resolve) => {
    const args = ['certonly', '--nginx', '--non-interactive'];

    if (email) {
      args.push('--email', email, '--agree-tos');
    } else {
      args.push('--register-unsafely-without-email');
    }

    domains.forEach(domain => {
      args.push('-d', domain);
    });

    const certbot = spawn('certbot', args);
    let stdout = '';
    let stderr = '';

    certbot.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    certbot.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    certbot.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output: stdout });
      } else {
        resolve({ success: false, error: stderr || stdout });
      }
    });

    certbot.on('error', (err) => {
      resolve({ success: false, error: `Failed to run certbot: ${err.message}` });
    });
  });
}

function renewCertificate(certName?: string): Promise<{ success: boolean; error?: string; output?: string }> {
  return new Promise((resolve) => {
    const args = ['renew', '--non-interactive'];

    if (certName) {
      args.push('--cert-name', certName);
    }

    const certbot = spawn('certbot', args);
    let stdout = '';
    let stderr = '';

    certbot.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    certbot.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    certbot.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output: stdout });
      } else {
        resolve({ success: false, error: stderr || stdout });
      }
    });

    certbot.on('error', (err) => {
      resolve({ success: false, error: `Failed to run certbot: ${err.message}` });
    });
  });
}

function deleteCertificate(certName: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const certbot = spawn('certbot', ['delete', '--non-interactive', '--cert-name', certName]);
    let stderr = '';

    certbot.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    certbot.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: stderr });
      }
    });

    certbot.on('error', (err) => {
      resolve({ success: false, error: `Failed to run certbot: ${err.message}` });
    });
  });
}

async function uploadCustomCertificate(
  certName: string,
  certContent: string,
  keyContent: string,
  chainContent?: string
): Promise<{ success: boolean; error?: string; paths?: { certPath: string; keyPath: string; chainPath?: string; fullchainPath?: string } }> {
  try {
    const baseDir = `/etc/letsencrypt/live/${certName}`;

    const exists = await access(baseDir).then(() => true).catch(() => false);
    if (exists) {
      return { success: false, error: `Certificate with name ${certName} already exists` };
    }

    await mkdir(baseDir, { recursive: true });

    const certPath = join(baseDir, 'cert.pem');
    const keyPath = join(baseDir, 'privkey.pem');
    const chainPath = chainContent ? join(baseDir, 'chain.pem') : undefined;
    const fullchainPath = chainContent ? join(baseDir, 'fullchain.pem') : undefined;

    await writeFile(certPath, certContent, 'utf8');
    await writeFile(keyPath, keyContent, 'utf8');

    if (chainContent && chainPath && fullchainPath) {
      await writeFile(chainPath, chainContent, 'utf8');
      await writeFile(fullchainPath, certContent + '\n' + chainContent, 'utf8');
    }

    return {
      success: true,
      paths: {
        certPath,
        keyPath,
        chainPath,
        fullchainPath
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

function getCertificateConfig(certName: string, serverName: string = '_'): string {
  const certPath = `/etc/letsencrypt/live/${certName}/fullchain.pem`;
  const keyPath = `/etc/letsencrypt/live/${certName}/privkey.pem`;

  return `server {
    listen 443 ssl;
    server_name ${serverName};

    ssl_certificate ${certPath};
    ssl_certificate_key ${keyPath};

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        root /var/www/html;
        index index.html;
    }
}`;
}

export {
  listCertificates,
  createCertificate,
  renewCertificate,
  deleteCertificate,
  uploadCustomCertificate,
  getCertificateConfig,
  type CertificateInfo
};
