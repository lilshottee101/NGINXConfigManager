<template>
  <UCard variant="soft" class="overflow-hidden h-full">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ $t('configEditor.title') }}</h3>
        <UBadge color="primary" variant="soft">{{ activeTabLabel }}</UBadge>
      </div>
    </template>

    <div class="overflow-auto h-full">
      <UTabs
        v-model="selectedTab"
        variant="link"
        :items="tabItems"
        class="[&>div.flex]:flex-wrap [&>div.flex]:gap-y-2 [&>div.flex>button]:whitespace-normal"
      >
        <template #overview>
          <div class="space-y-6 p-4">
            <div class="space-y-1">
              <UFormGroup :label="$t('label.serverListen')" :help="$t('tooltip.serverListen')">
                <UInput
                  v-model="serverListen"
                  placeholder="80"
                  icon="i-lucide-network"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.serverName')" :help="$t('tooltip.serverName')">
                <UInput
                  v-model="serverName"
                  placeholder="example.com"
                  icon="i-lucide-globe"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.serverRoot')" :help="$t('tooltip.serverRoot')">
                <UInput
                  v-model="serverRoot"
                  placeholder="/var/www/html"
                  icon="i-lucide-folder"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.serverIndex')" :help="$t('tooltip.serverIndex')">
                <UInput
                  v-model="serverIndex"
                  placeholder="index.html"
                  icon="i-lucide-file"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.serverAutoindex')" :help="$t('tooltip.serverAutoindex')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="serverAutoindex" size="lg" />
                  <span class="text-sm font-medium">{{ serverAutoindex ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>

        <template #ssl>
          <div class="space-y-6 p-4">
            <div class="space-y-1">
              <UFormGroup :label="$t('label.sslEnabled')" :help="$t('tooltip.sslEnabled')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="sslEnabled" size="lg" />
                  <span class="text-sm font-medium">{{ sslEnabled ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.selectCertificate')" :help="$t('tooltip.selectCertificate')">
                <div class="flex gap-2">
                  <USelect
                    v-model="selectedCertificate"
                    :options="certificateOptions"
                    :placeholder="$t('placeholder.selectCertificate')"
                    class="flex-1"
                    size="lg"
                    icon="i-lucide-shield-check"
                    :loading="loadingCertificates"
                  />
                  <UButton
                    icon="i-lucide-download"
                    color="primary"
                    variant="soft"
                    size="lg"
                    :disabled="!selectedCertificate"
                    @click="loadCertificatePaths"
                  >
                    {{ $t('button.load') }}
                  </UButton>
                </div>
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.sslCertificate')" :help="$t('tooltip.sslCertificate')">
                <UInput
                  v-model="sslCertificate"
                  placeholder="/etc/ssl/certs/cert.pem"
                  icon="i-lucide-file-key"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.sslCertificateKey')" :help="$t('tooltip.sslCertificateKey')">
                <UInput
                  v-model="sslCertificateKey"
                  placeholder="/etc/ssl/private/key.pem"
                  icon="i-lucide-key"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.sslProtocols')" :help="$t('tooltip.sslProtocols')">
                <UInput
                  v-model="sslProtocols"
                  placeholder="TLSv1.2 TLSv1.3"
                  icon="i-lucide-shield"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.sslHSTS')" :help="$t('tooltip.sslHSTS')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="sslHSTS" size="lg" />
                  <span class="text-sm font-medium">{{ sslHSTS ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>

        <template #locations>
          <div class="space-y-6 p-4">
            <div class="space-y-1">
              <UFormGroup :label="$t('label.locationPath')" :help="$t('tooltip.locationPath')">
                <UInput
                  v-model="locationPath"
                  placeholder="/example"
                  icon="i-lucide-route"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.locationRoot')" :help="$t('tooltip.locationRoot')">
                <UInput
                  v-model="locationRoot"
                  placeholder="/var/www/html"
                  icon="i-lucide-folder"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.locationProxyPass')" :help="$t('tooltip.locationProxyPass')">
                <UInput
                  v-model="locationProxyPass"
                  placeholder="http://127.0.0.1:3000"
                  icon="i-lucide-waypoints"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.locationTryFiles')" :help="$t('tooltip.locationTryFiles')">
                <UInput
                  v-model="locationTryFiles"
                  placeholder="$uri $uri/ /index.html"
                  icon="i-lucide-file-search"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.locationEnableCaching')" :help="$t('tooltip.locationEnableCaching')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="locationEnableCaching" size="lg" />
                  <span class="text-sm font-medium">{{ locationEnableCaching ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>

        <template #reverseProxy>
          <div class="space-y-6 p-4">
            <div class="space-y-1">
              <UFormGroup :label="$t('label.proxyPass')" :help="$t('tooltip.proxyPass')">
                <UInput
                  v-model="proxyPass"
                  placeholder="http://127.0.0.1:3000"
                  icon="i-lucide-waypoints"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.proxyForwardHost')" :help="$t('tooltip.proxyForwardHost')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="proxyForwardHost" size="lg" />
                  <span class="text-sm font-medium">{{ proxyForwardHost ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.proxyPassRealIP')" :help="$t('tooltip.proxyPassRealIP')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="proxyPassRealIP" size="lg" />
                  <span class="text-sm font-medium">{{ proxyPassRealIP ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.proxyWebsockets')" :help="$t('tooltip.proxyWebsockets')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="proxyWebsockets" size="lg" />
                  <span class="text-sm font-medium">{{ proxyWebsockets ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.proxyTimeout')" :help="$t('tooltip.proxyTimeout')">
                <UInput
                  v-model="proxyTimeout"
                  placeholder="60s"
                  icon="i-lucide-timer"
                  size="lg"
                />
              </UFormGroup>
            </div>
          </div>
        </template>

        <template #logging>
          <div class="space-y-6 p-4">
            <div class="space-y-1">
              <UFormGroup :label="$t('label.accessLog')" :help="$t('tooltip.accessLog')">
                <UInput
                  v-model="accessLog"
                  placeholder="/var/log/nginx/access.log"
                  icon="i-lucide-file-text"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.accessLogFormat')" :help="$t('tooltip.accessLogFormat')">
                <UInput
                  v-model="accessLogFormat"
                  placeholder="combined"
                  icon="i-lucide-list"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.errorLog')" :help="$t('tooltip.errorLog')">
                <UInput
                  v-model="errorLog"
                  placeholder="/var/log/nginx/error.log"
                  icon="i-lucide-alert-circle"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.errorLogLevel')" :help="$t('tooltip.errorLogLevel')">
                <UInput
                  v-model="errorLogLevel"
                  placeholder="warn"
                  icon="i-lucide-gauge"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.disableAccessLog')" :help="$t('tooltip.disableAccessLog')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="disableAccessLog" size="lg" />
                  <span class="text-sm font-medium">{{ disableAccessLog ? 'Disabled' : 'Enabled' }}</span>
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>

        <template #performance>
          <div class="space-y-6 p-4">
            <div class="space-y-1">
              <UFormGroup :label="$t('label.gzip')" :help="$t('tooltip.gzip')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="gzip" size="lg" />
                  <span class="text-sm font-medium">{{ gzip ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.gzipMinLength')" :help="$t('tooltip.gzipMinLength')">
                <UInput
                  v-model="gzipMinLength"
                  placeholder="1000"
                  type="number"
                  icon="i-lucide-hash"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.clientMaxBodySize')" :help="$t('tooltip.clientMaxBodySize')">
                <UInput
                  v-model="clientMaxBodySize"
                  placeholder="1m"
                  icon="i-lucide-hard-drive"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.keepaliveTimeout')" :help="$t('tooltip.keepaliveTimeout')">
                <UInput
                  v-model="keepaliveTimeout"
                  placeholder="65s"
                  icon="i-lucide-timer"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.sendfile')" :help="$t('tooltip.sendfile')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="sendfile" size="lg" />
                  <span class="text-sm font-medium">{{ sendfile ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>
          </div>
        </template>

        <template #accessControl>
          <div class="space-y-6 p-4">
            <div class="space-y-1">
              <UFormGroup :label="$t('label.allowIP')" :help="$t('tooltip.allowIP')">
                <UInput
                  v-model="allowIP"
                  placeholder="1.2.3.4"
                  icon="i-lucide-shield-check"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.denyIP')" :help="$t('tooltip.denyIP')">
                <UInput
                  v-model="denyIP"
                  placeholder="all"
                  icon="i-lucide-shield-x"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.basicAuth')" :help="$t('tooltip.basicAuth')">
                <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <USwitch v-model="basicAuth" size="lg" />
                  <span class="text-sm font-medium">{{ basicAuth ? 'Enabled' : 'Disabled' }}</span>
                </div>
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.limitReq')" :help="$t('tooltip.limitReq')">
                <UInput
                  v-model="limitReq"
                  placeholder="10r/s"
                  icon="i-lucide-gauge"
                  size="lg"
                />
              </UFormGroup>
            </div>

            <div class="space-y-1">
              <UFormGroup :label="$t('label.limitConn')" :help="$t('tooltip.limitConn')">
                <UInput
                  v-model="limitConn"
                  placeholder="10"
                  icon="i-lucide-activity"
                  size="lg"
                />
              </UFormGroup>
            </div>
          </div>
        </template>

        <template #templates>
          <div class="p-4">
            <div class="rounded-lg bg-muted/50 p-4">
              <h4 class="text-sm font-medium mb-2">{{ $t('configEditor.configurationObject') }}</h4>
              <pre class="text-xs overflow-auto">{{ codeObject }}</pre>
            </div>
          </div>
        </template>
      </UTabs>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  codeObject: any
}>()

const { t } = useI18n()
const nginxApi = useNginxApi()
const toast = useToast()

const selectedTab = ref(0)
const selectedCertificate = ref('')
const certificates = ref<any[]>([])
const loadingCertificates = ref(false)

const certificateOptions = computed(() => {
  return certificates.value.map(cert => ({
    label: `${cert.name} (${cert.domains.join(', ')})`,
    value: cert.name
  }))
})

async function loadAvailableCertificates() {
  loadingCertificates.value = true
  try {
    certificates.value = await nginxApi.getCertificates()
  } catch (err: any) {
    console.error('Failed to load certificates:', err)
  } finally {
    loadingCertificates.value = false
  }
}

function loadCertificatePaths() {
  if (!selectedCertificate.value) return

  const cert = certificates.value.find(c => c.name === selectedCertificate.value)
  if (!cert) return

  sslCertificate.value = cert.fullchainPath || cert.certPath
  sslCertificateKey.value = cert.keyPath
  sslEnabled.value = true

  const currentListen = serverListen.value || ''
  if (!currentListen.includes('443')) {
    serverListen.value = '443 ssl'
  }

  toast.add({
    title: t('toast.certificateLoaded'),
    description: t('toast.certificateLoadedDescription', { name: cert.name }),
    color: 'green'
  })
}

onMounted(() => {
  loadAvailableCertificates()
})

const tabItems = [
  {
    label: $t('tabOverview'),
    icon: 'i-lucide-house',
    slot: 'overview'
  },
  {
    label: $t('tabSsl'),
    icon: 'i-lucide-lock',
    slot: 'ssl'
  },
  {
    label: $t('tabLocations'),
    icon: 'i-lucide-route',
    slot: 'locations'
  },
  {
    label: $t('tabReverseProxy'),
    icon: 'i-lucide-waypoints',
    slot: 'reverseProxy'
  },
  {
    label: $t('tabLogging'),
    icon: 'i-lucide-logs',
    slot: 'logging'
  },
  {
    label: $t('tabPerformance'),
    icon: 'i-lucide-gauge',
    slot: 'performance'
  },
  {
    label: $t('tabAccessControl'),
    icon: 'i-lucide-lock',
    slot: 'accessControl'
  },
  {
    label: $t('tabTemplates'),
    icon: 'i-lucide-layout-template',
    slot: 'templates'
  },
]

const activeTabLabel = computed(() => tabItems[selectedTab.value]?.label || '')

function createComputedProp(path: string, isBoolean = false) {
  return computed({
    get: () => {
      const keys = path.split('.');
      let current = props.codeObject;

      for (const key of keys) {
        if (!current || typeof current !== 'object') {
          return isBoolean ? false : '';
        }

        const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) {
          const [, arrayName, index] = arrayMatch;
          if (!current[arrayName] || !Array.isArray(current[arrayName])) {
            return isBoolean ? false : '';
          }
          current = current[arrayName][parseInt(index)];
        } else {
          current = current[key];
        }
      }

      if (isBoolean) {
        if (current === 'on' || current === true || current === 'true') {
          return true;
        }
        return false;
      }

      return current || '';
    },
    set: (value) => {
      const keys = path.split('.');

      if (!props.codeObject.server) {
        props.codeObject.server = {};
      }

      let current = props.codeObject;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) {
          const [, arrayName, index] = arrayMatch;
          const idx = parseInt(index);

          if (!current[arrayName]) {
            current[arrayName] = [];
          }
          if (!Array.isArray(current[arrayName])) {
            current[arrayName] = [];
          }
          if (!current[arrayName][idx]) {
            current[arrayName][idx] = {};
          }
          current = current[arrayName][idx];
        } else {
          if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
          }
          current = current[key];
        }
      }

      const finalKey = keys[keys.length - 1];

      const arrayMatch = finalKey.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        const idx = parseInt(index);

        if (!current[arrayName]) {
          current[arrayName] = [];
        }
        if (!Array.isArray(current[arrayName])) {
          current[arrayName] = [];
        }

        if (isBoolean) {
          if (!current[arrayName][idx]) {
            current[arrayName][idx] = {};
          }
          current[arrayName][idx] = value ? 'on' : 'off';
        } else if (value === '' || value === null || value === undefined) {
          if (current[arrayName][idx]) {
            delete current[arrayName][idx];
          }
        } else {
          if (!current[arrayName][idx]) {
            current[arrayName][idx] = {};
          }
          current[arrayName][idx] = value;
        }
      } else {
        if (isBoolean) {
          current[finalKey] = value ? 'on' : 'off';
        } else if (value === '' || value === null || value === undefined) {
          delete current[finalKey];
        } else {
          current[finalKey] = value;
        }
      }
    }
  });
}

// Overview
const serverListen = createComputedProp('server.listen')
const serverName = createComputedProp('server.server_name')
const serverRoot = createComputedProp('server.root')
const serverIndex = createComputedProp('server.index')
const serverAutoindex = createComputedProp('server.autoindex', true)
// SSL
const sslEnabled = createComputedProp('server.ssl', true)
const sslCertificate = createComputedProp('server.ssl_certificate')
const sslCertificateKey = createComputedProp('server.ssl_certificate_key')
const sslProtocols = createComputedProp('server.ssl_protocols')
const sslHSTS = createComputedProp('server.add_header_Strict-Transport-Security', true)
// Locations
const locationPath = createComputedProp('server.locations[0].path')
const locationRoot = createComputedProp('server.locations[0].root')
const locationProxyPass = createComputedProp('server.locations[0].proxy_pass')
const locationTryFiles = createComputedProp('server.locations[0].try_files')
const locationEnableCaching = createComputedProp('server.locations[0].enable_caching', true)
// Reverse Proxy
const proxyPass = createComputedProp('server.proxy_pass')
const proxyForwardHost = createComputedProp('server.proxy_set_header_Host', true)
const proxyPassRealIP = createComputedProp('server.proxy_set_header_X-Real-IP', true)
const proxyWebsockets = createComputedProp('server.proxy_websockets', true)
const proxyTimeout = createComputedProp('server.proxy_read_timeout')
// Logging
const accessLog = createComputedProp('server.access_log')
const accessLogFormat = createComputedProp('server.log_format')
const errorLog = createComputedProp('server.error_log')
const errorLogLevel = createComputedProp('server.error_log_level')
const disableAccessLog = createComputedProp('server.access_log_off', true)
// Performance
const gzip = createComputedProp('server.gzip', true)
const gzipMinLength = createComputedProp('server.gzip_min_length')
const clientMaxBodySize = createComputedProp('server.client_max_body_size')
const keepaliveTimeout = createComputedProp('server.keepalive_timeout')
const sendfile = createComputedProp('server.sendfile', true)
// Access Control
const allowIP = createComputedProp('server.allow')
const denyIP = createComputedProp('server.deny')
const basicAuth = createComputedProp('server.auth_basic', true)
const limitReq = createComputedProp('server.limit_req')
const limitConn = createComputedProp('server.limit_conn')
</script>
