<template>
  <UPage>
    <UPageBody class="flex flex-col h-full py-4">
      <div class="mb-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold">{{ activeSite?.name }}</h1>
              <UBadge :color="activeSite?.enabled ? 'green' : 'gray'" variant="soft" size="lg">
                {{ activeSite?.enabled ? $t('active') : $t('inactive') }}
              </UBadge>
              <UBadge v-if="hasUnsavedChanges" color="orange" variant="soft" size="lg">
                {{ $t('badge.unsavedChanges') }}
              </UBadge>
            </div>
            <p class="text-muted">{{ $t('page.site.subtitle') }}</p>
          </div>
        </div>
        <div class="flex gap-2">
            <UButton
              :label="$t('button.enable')"
              icon="i-lucide-power"
              color="success"
              v-if="!activeSite?.enabled"
              :disabled="hasUnsavedChanges || isTogglingStatus"
              :loading="isTogglingStatus"
              @click="handleToggleStatus"
            />

            <UButton
              :label="$t('button.disable')"
              icon="i-lucide-power-off"
              color="error"
              v-if="activeSite?.enabled"
              :disabled="hasUnsavedChanges || isTogglingStatus"
              :loading="isTogglingStatus"
              @click="handleToggleStatus"
            />

            <UButton
              v-if="hasUnsavedChanges"
              :label="$t('button.saveChanges')"
              icon="i-lucide-save"
              color="primary"
              :disabled="isSaving"
              :loading="isSaving"
              @click="handleSave(false)"
            />

            <UButton
              v-if="hasUnsavedChanges"
              :label="$t('button.discardChanges')"
              icon="i-lucide-x"
              color="neutral"
              variant="outline"
              @click="handleDiscardChanges"
            />

            <UButton
              :label="$t('button.testConfig')"
              icon="i-lucide-flask-conical"
              variant="outline"
              :disabled="isTesting"
              :loading="isTesting"
              @click="handleTestConfig"
            />

            <UButton
              :label="$t('button.delete')"
              icon="i-lucide-trash-2"
              color="red"
              variant="outline"
              @click="handleDeleteSite"
            />
          </div>
      </div>

      <USeparator />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <UCard variant="soft">
          <MonacoEditor v-model="code" :style="{ height: '400px' }" lang="nginx" theme="vs-dark"
            :options="editorOptions" class="h-full w-full" />
        </UCard>

        <NginxConfigEditor :code-object="codeObject" />
      </div>
    </UPageBody>
  </UPage>

</template>
<script setup lang="ts">
import ConfigParser from '@webantic/nginx-config-parser';
import { useSitesStore } from '~/stores/sitesStore'
import ValidationErrorModal from '~/components/ValidationErrorModal'
import TestSuccessModal from '~/components/TestSuccessModal'

const { t } = useI18n()
const siteStore = useSitesStore()
const parser = new ConfigParser()
const overlay = useOverlay()
const toast = useToast()
const nginxApi = useNginxApi()

const activeSite = computed(() => siteStore.activeSite)
const currentSiteId = ref(activeSite.value?.id)

// MonacoEditor Variables and Config
const code = ref('')
const originalCode = ref('')
const codeObject = ref({})
const isSaving = ref(false)
const isTesting = ref(false)
const isTogglingStatus = ref(false)

const hasUnsavedChanges = computed(() => {
  try {
    const pa = parser.toJSON(code.value)
    const pb = parser.toJSON(originalCode.value)
    return JSON.stringify(pa) !== JSON.stringify(pb)
  } catch (e) {
    const normalizeConf = (conf: string) => conf.replace(/\s+/g, ' ').trim()
    return normalizeConf(code.value) !== normalizeConf(originalCode.value)
  }
})

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
  console.log(code, codeObject)
})

watch(codeObject, (newObj) => {
  if (isUpdatingFromCode) return

  isUpdatingFromJSON = true
  try {
    updateCodeFromJSON(newObj)
  } finally {
    isUpdatingFromJSON = false
  }
  console.log(code, codeObject)
}, { deep: true })

function showValidationErrorModal(response: any) {
  const validationModal = overlay.create(ValidationErrorModal, {
    props: {
      error: response.error,
      validationError: response.validationError,
      onOverride: async () => {
        await handleSave(true)
      }
    }
  })

  validationModal.open()
}

async function handleSave(override = false) {
  if (!activeSite.value) return

  isSaving.value = true

  try {
    const response = await nginxApi.updateSite(
      activeSite.value.name,
      code.value,
      activeSite.value.active,
      override
    )

    if (response.success) {
      originalCode.value = code.value

      toast.add({
        title: t('toast.success'),
        description: response.message,
        color: 'green'
      })

      await refreshSites()
    } else {
      showValidationErrorModal(response)
    }
  } catch (err) {
    toast.add({
      title: t('toast.error'),
      description: err.message || t('toast.failedToSave'),
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}


async function handleToggleStatus() {
  if (!activeSite.value || hasUnsavedChanges.value) return

  isTogglingStatus.value = true

  try {
    const newStatus = !activeSite.value.enabled

    const response = await nginxApi.updateSite(
      activeSite.value.name,
      code.value,
      newStatus,
      false
    )

    if (response.success) {
      toast.add({
        title: t('toast.success'),
        description: t('toast.siteStatusChanged', { status: t(newStatus ? 'enabled' : 'disabled') }),
        color: 'green'
      })

      await refreshSites()
    } else {
      toast.add({
        title: t('toast.error'),
        description: response.error,
        color: 'red'
      })
    }
  } catch (err) {
    toast.add({
      title: t('toast.error'),
      description: err.message || t('toast.failedToToggleStatus'),
      color: 'red'
    })
  } finally {
    isTogglingStatus.value = false
  }
}

async function handleTestConfig() {
  if (!activeSite.value) return

  isTesting.value = true

  try {
    const response = await nginxApi.updateSite(
      activeSite.value.name + '.test',
      code.value,
      false,
      false
    )

    if (response.success) {
      const successModal = overlay.create(TestSuccessModal)
      successModal.open()
    } else {
      showValidationErrorModal(response)
    }
  } catch (err) {
    toast.add({
      title: t('toast.error'),
      description: err.message || t('toast.failedToTest'),
      color: 'red'
    })
  } finally {
    isTesting.value = false
  }
}

function handleDiscardChanges() {
  if (confirm(t('confirm.discardChanges'))) {
    code.value = originalCode.value
    updateJSONFromCode(code.value)
    toast.add({
      title: t('toast.changesDiscarded'),
      description: t('toast.changesReverted'),
      color: 'gray'
    })
  }
}

async function handleDeleteSite() {
  if (!activeSite.value) return

  if (!confirm(t('confirm.deleteSite', { name: activeSite.value.name }))) {
    return
  }

  try {
    const response = await nginxApi.deleteSite(activeSite.value.name)

    if (response.success) {
      toast.add({
        title: t('toast.success'),
        description: response.message,
        color: 'green'
      })

      await refreshSites()

      siteStore.clearActiveSite()
    } else {
      toast.add({
        title: t('toast.error'),
        description: response.error,
        color: 'red'
      })
    }
  } catch (err) {
    toast.add({
      title: t('toast.error'),
      description: err.message || t('toast.failedToDelete'),
      color: 'red'
    })
  }
}

async function refreshSites() {
  try {
    const sites = await nginxApi.getSites()
    if (Array.isArray(sites)) {
      siteStore.setSites(sites)
    }
  } catch (err) {
    console.error('Failed to refresh sites:', err)
  }
}

watch(() => siteStore.activeSiteId, async (newSiteId, oldSiteId) => {
  if (!newSiteId || newSiteId === currentSiteId.value) {
    return
  }

  if (hasUnsavedChanges.value) {
    await nextTick()

    const confirmed = confirm(t('confirm.unsavedChanges'))

    if (!confirmed) {
      siteStore.setActiveSite(currentSiteId.value)
      return
    }
  }

  currentSiteId.value = newSiteId
  const newActiveSite = siteStore.activeSite
  if (newActiveSite) {
    code.value = newActiveSite.contents
    originalCode.value = newActiveSite.contents
    updateJSONFromCode(code.value)
  }
})

onMounted(() => {
  if (activeSite.value) {
    code.value = activeSite.value.contents
    originalCode.value = activeSite.value.contents
    currentSiteId.value = activeSite.value.id
    updateJSONFromCode(code.value)
  }
})
</script>
