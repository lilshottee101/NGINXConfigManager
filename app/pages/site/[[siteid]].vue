<template>
  <UPage>
    <UPageBody class="flex flex-col h-full">
      <!-- Top Section -->
      <div class="mb-6">
        <h2>{{ activeSite.name }}</h2>
        <p>Smaller Text</p>
      </div>

      <USeparator />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <UCard variant="soft">
          <MonacoEditor v-model="code" :style="{ height: '400px' }" language="nginx" theme="vs-dark" :options="editorOptions" class="h-full w-full"/>
        </UCard>

        <UCard variant="soft" class="overflow-auto">
          <UTabs variant="link" :items="tabItems" class="[&>div.flex]:flex-wrap [&>div.flex]:gap-y-2 [&>div.flex>button]:whitespace-normal">
            <template #overview>
              <div class="space-y-4">
                <UTooltip :text="$t('tooltip.serverListen')">
                  <UInput v-model="serverListen" placeholder="" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span class="inline-flex bg-default px-1">{{ $t('label.serverListen') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.serverName')">
                  <UInput v-model="serverName" placeholder="" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span class="inline-flex bg-default px-1">{{ $t('label.serverName') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.serverRoot')">
                  <UInput v-model="serverRoot" placeholder="" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span class="inline-flex bg-default px-1">{{ $t('label.serverRoot') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.serverIndex')">
                  <UInput v-model="serverIndex" placeholder="" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span class="inline-flex bg-default px-1">{{ $t('label.serverIndex') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.serverAutoindex')">
                  <USwitch label="" v-model="serverAutoindex" />
                </UTooltip>
              </div>
            </template>
            <template #ssl>
              <div class="space-y-4">
                <UTooltip :text="$t('tooltip.sslEnabled')">
                  <USwitch label="" v-model="sslEnabled" />
                </UTooltip>

                <UTooltip :text="$t('tooltip.sslCertificate')">
                  <UInput v-model="sslCertificate" placeholder="" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.sslCertificate') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.sslCertificateKey')">
                  <UInput v-model="sslCertificateKey" placeholder="" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.sslCertificateKey') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.sslProtocols')">
                  <UInput v-model="sslProtocols" placeholder="TLSv1.2 TLSv1.3" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.sslProtocols') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.sslHSTS')">
                  <USwitch label="" v-model="sslHSTS" />
                </UTooltip>
              </div>
            </template>
            <template #locations>
              <div class="space-y-4">
                <UTooltip :text="$t('tooltip.locationPath')">
                  <UInput v-model="locationPath" placeholder="/example" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.locationPath') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.locationRoot')">
                  <UInput v-model="locationRoot" placeholder="" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.locationRoot') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.locationProxyPass')">
                  <UInput v-model="locationProxyPass" placeholder="http://127.0.0.1:3000" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.locationProxyPass') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.locationTryFiles')">
                  <UInput v-model="locationTryFiles" placeholder="$uri $uri/ /index.html" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.locationTryFiles') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.locationEnableCaching')">
                  <USwitch label="" v-model="locationEnableCaching" />
                </UTooltip>
              </div>
            </template>
            <template #reverseProxy>
              <div class="space-y-4">
                <UTooltip :text="$t('tooltip.proxyPass')">
                  <UInput v-model="proxyPass" placeholder="http://127.0.0.1:3000" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.proxyPass') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.proxyForwardHost')">
                  <USwitch label="" v-model="proxyForwardHost" />
                </UTooltip>

                <UTooltip :text="$t('tooltip.proxyPassRealIP')">
                  <USwitch label="" v-model="proxyPassRealIP" />
                </UTooltip>

                <UTooltip :text="$t('tooltip.proxyWebsockets')">
                  <USwitch label="" v-model="proxyWebsockets" />
                </UTooltip>

                <UTooltip :text="$t('tooltip.proxyTimeout')">
                  <UInput v-model="proxyTimeout" placeholder="60s" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.proxyTimeout') }}</span>
                    </label>
                  </UInput>
                </UTooltip>
              </div>
            </template>
            <template #logging>
              <div class="space-y-4">
                <UTooltip :text="$t('tooltip.accessLog')">
                  <UInput v-model="accessLog" placeholder="/var/log/nginx/access.log" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.accessLog') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.accessLogFormat')">
                  <UInput v-model="accessLogFormat" placeholder="combined" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.accessLogFormat') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.errorLog')">
                  <UInput v-model="errorLog" placeholder="/var/log/nginx/error.log" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.errorLog') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.errorLogLevel')">
                  <UInput v-model="errorLogLevel" placeholder="warn" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.errorLogLevel') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.disableAccessLog')">
                  <USwitch label="" v-model="disableAccessLog" />
                </UTooltip>
              </div>
            </template>
            <template #performance>
              <div class="space-y-4">
                <UTooltip :text="$t('tooltip.gzip')">
                  <USwitch label="" v-model="gzip" />
                </UTooltip>

                <UTooltip :text="$t('tooltip.gzipMinLength')">
                  <UInput v-model="gzipMinLength" placeholder="1000" type="number" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.gzipMinLength') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.clientMaxBodySize')">
                  <UInput v-model="clientMaxBodySize" placeholder="1m" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.clientMaxBodySize') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.keepaliveTimeout')">
                  <UInput v-model="keepaliveTimeout" placeholder="65s" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.keepaliveTimeout') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.sendfile')">
                  <USwitch label="" v-model="sendfile" />
                </UTooltip>
              </div>
            </template>
            <template #accessControl>
              <div class="space-y-4">
                <UTooltip :text="$t('tooltip.allowIP')">
                  <UInput v-model="allowIP" placeholder="1.2.3.4" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.allowIP') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.denyIP')">
                  <UInput v-model="denyIP" placeholder="all" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.denyIP') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.basicAuth')">
                  <USwitch label="" v-model="basicAuth" />
                </UTooltip>

                <UTooltip :text="$t('tooltip.limitReq')">
                  <UInput v-model="limitReq" placeholder="10r/s" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.limitReq') }}</span>
                    </label>
                  </UInput>
                </UTooltip>

                <UTooltip :text="$t('tooltip.limitConn')">
                  <UInput v-model="limitConn" placeholder="10" :ui="{ base: 'peer' }">
                    <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                      <span>{{ $t('label.limitConn') }}</span>
                    </label>
                  </UInput>
                </UTooltip>
              </div>
            </template>
            <template #templates>
              <h1>{{ codeObject }}</h1>
            </template>
          </UTabs>
        </UCard>
      </div>
    </UPageBody>
  </UPage>

</template>
<script setup lang="ts">
import ConfigParser from '@webantic/nginx-config-parser';
import { useSitesStore } from '~/stores/sitesStore'

const siteStore = useSitesStore()

const parser = new ConfigParser()

const activeSite = siteStore.activeSite

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

// MonacoEditor Variables and Config
const code = activeSite.contents
const codeObject = ref({})

function createComputedProp(path) {
  return computed({
    get: () => {
      const keys = path.split('.');
      let current = codeObject.value;

      for (const key of keys) {
        if (!current || typeof current !== 'object') {
          return '';
        }
        current = current[key];
      }

      return current || '';
    },
    set: (value) => {
      const keys = path.split('.');

      if (!codeObject.value) {
        codeObject.value = {};
      }

      let current = codeObject.value;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }

      const finalKey = keys[keys.length - 1];

      if (value === '' || value === null || value === undefined) {
        delete current[finalKey];
      } else {
        current[finalKey] = value;
      }
    }
  });
}

// Create Computed Props for all Inputs
// Overview
const serverListen = createComputedProp('server.listen')
const serverName = createComputedProp('server.server_name')
const serverRoot = createComputedProp('server.root')
const serverIndex = createComputedProp('server.index')
const serverAutoindex = createComputedProp('server.autoindex')
// SSL
const sslEnabled = createComputedProp('server.ssl')
const sslCertificate = createComputedProp('server.ssl_certificate')
const sslCertificateKey = createComputedProp('server.ssl_certificate_key')
const sslProtocols = createComputedProp('server.ssl_protocols')
const sslHSTS = createComputedProp('server.add_header_Strict-Transport-Security')
// Locations
const locationPath = createComputedProp('server.locations[0].path')
const locationRoot = createComputedProp('server.locations[0].root')
const locationProxyPass = createComputedProp('server.locations[0].proxy_pass')
const locationTryFiles = createComputedProp('server.locations[0].try_files')
const locationEnableCaching = createComputedProp('server.locations[0].enable_caching')
// Reverse Proxy
const proxyPass = createComputedProp('server.proxy_pass')
const proxyForwardHost = createComputedProp('server.proxy_set_header_Host')
const proxyPassRealIP = createComputedProp('server.proxy_set_header_X-Real-IP')
const proxyWebsockets = createComputedProp('server.proxy_websockets')
const proxyTimeout = createComputedProp('server.proxy_read_timeout')
// Logging
const accessLog = createComputedProp('server.access_log')
const accessLogFormat = createComputedProp('server.log_format')
const errorLog = createComputedProp('server.error_log')
const errorLogLevel = createComputedProp('server.error_log_level')
const disableAccessLog = createComputedProp('server.access_log_off')
// Performance
const gzip = createComputedProp('server.gzip')
const gzipMinLength = createComputedProp('server.gzip_min_length')
const clientMaxBodySize = createComputedProp('server.client_max_body_size')
const keepaliveTimeout = createComputedProp('server.keepalive_timeout')
const sendfile = createComputedProp('server.sendfile')
// Access Control
const allowIP = createComputedProp('server.allow')
const denyIP = createComputedProp('server.deny')
const basicAuth = createComputedProp('server.auth_basic')
const limitReq = createComputedProp('server.limit_req')
const limitConn = createComputedProp('server.limit_conn')

const editorOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true,
  readOnly: false
};

function updateJSONFromCode(newCode: string) {
  try {
    const parsed = parser.toJSON(newCode)
    codeObject.value = parsed
  } catch (err) {
    console.error('Parse error:', err)
  }
}

function updateCodeFromJSON(newObj: any) {
  try {
    const text = parser.toConf(newObj)
    code.value = text
  } catch (err) {
    console.error('Build error:', err)
  }
}

let isUpdatingFromCode = false
let isUpdatingFromJSON = false

watch(code, (newCode) => {
  if (isUpdatingFromJSON) return

  isUpdatingFromCode = true
  try {
    updateJSONFromCode(newCode)
  } finally {
    isUpdatingFromCode = false
  }
})

watch(codeObject, (newObj) => {
  if (isUpdatingFromCode) return

  isUpdatingFromJSON = true
  try {
    updateCodeFromJSON(newObj)
  } finally {
    isUpdatingFromJSON = false
  }
}, { deep: true })

onMounted(() => {
  updateJSONFromCode(code.value)
})
</script>
