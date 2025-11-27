<template>
  <UPage>
    <UPageBody class="flex flex-col h-full">
      <!-- Top Section -->
      <div class="mb-6">
        <h2>Test Title</h2>
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
              <UInput v-model="codeObject.server.?listen"/>
            </template>
            <template #ssl>
              <h2>Test SSL</h2>
            </template>
            <template #locations>
              <h1>Insert PlaceHolder Here. (This is funny)</h1>
            </template>
            <template #reverseProxy>
              <h1>Insert PlaceHolder Here. (This is funny)</h1>
            </template>
            <template #logging>
              <h1>Insert PlaceHolder Here. (This is funny)</h1>
            </template>
            <template #performance>
              <h1>Insert PlaceHolder Here. (This is funny)</h1>
            </template>
            <template #accessControl>
              <h1>Insert PlaceHolder Here. (This is funny)</h1>
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
const parser = new ConfigParser()

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
const code = ref(`
  server {
    listen 80;
    server_name example.com;

    location / {
      proxy_pass http://localhost:3000;
    }
  }
  `)
const codeObject = ref({})

let isSyncing = false

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
const serverListen = computed({
  get() {
    return codeObject.value.server?.listen
  },
  set(value) {

  }
})
watch([code, codeObject], ([newCode, newObj], [oldCode, oldObj]) => {
  if (isSyncing) return
  isSyncing = true

  if (newCode !== oldCode) {
    updateJSONFromCode(newCode)
  } else if (newObj !== oldObj) {
    updateCodeFromJSON(newObj)
  }

  isSyncing = false
}, { deep: true });
onMounted(() => {
  updateJSONFromCode(code)
})
</script>
