<template>
  <UModal v-model:open="isOpen" :title="$t('modal.createNewSite')" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="space-y-4">
        <UFormField :label="$t('label.siteName')" required>
          <UInput
            v-model="siteName"
            :placeholder="$t('placeholder.siteName')"
            icon="i-lucide-globe"
            size="lg"
            :disabled="isCreating"
          />
          <template #help>
            {{ $t('createSiteModal.siteNameHelp') }}
          </template>
        </UFormField>

        <UFormField :label="$t('label.initialConfiguration')">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <USwitch v-model="useCustomConfig" :disabled="isCreating" />
              <span class="text-sm font-medium">{{ $t('createSiteModal.useCustomConfig') }}</span>
            </div>

            <UTextarea
              v-if="useCustomConfig"
              v-model="customConfig"
              :rows="10"
              :placeholder="$t('placeholder.serverConfig')"
              class="font-mono text-sm"
              :disabled="isCreating"
            />
            <p v-else class="text-sm text-muted">
              {{ $t('createSiteModal.defaultConfigDescription') }}
            </p>
          </div>
        </UFormField>

        <UFormField :label="$t('label.enableSite')">
          <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <USwitch v-model="enabled" size="lg" :disabled="isCreating" />
            <span class="text-sm font-medium">{{ enabled ? $t('enabled') : $t('disabled') }}</span>
          </div>
          <template #help>
            {{ $t('createSiteModal.enabledSitesHelp') }}
          </template>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <UButton
        :label="$t('button.cancel')"
        variant="outline"
        @click="close"
        :disabled="isCreating"
      />
      <UButton
        :label="$t('button.createSite')"
        icon="i-lucide-plus"
        color="primary"
        :loading="isCreating"
        :disabled="!canCreate"
        @click="handleCreate"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'created': []
}>()

const { t } = useI18n()
const nginxApi = useNginxApi()
const toast = useToast()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const siteName = ref('')
const useCustomConfig = ref(false)
const customConfig = ref('')
const enabled = ref(false)
const isCreating = ref(false)

const canCreate = computed(() => {
  return siteName.value.trim().length > 0
})

function close() {
  if (!isCreating.value) {
    isOpen.value = false
    resetForm()
  }
}

function resetForm() {
  siteName.value = ''
  useCustomConfig.value = false
  customConfig.value = ''
  enabled.value = false
}

async function handleCreate() {
  if (!canCreate.value) return

  isCreating.value = true

  try {
    const content = useCustomConfig.value ? customConfig.value : undefined
    const response = await nginxApi.createSite(
      siteName.value.trim(),
      content,
      enabled.value
    )

    if (response.success) {
      toast.add({
        title: t('toast.success'),
        description: response.message,
        color: 'green'
      })

      emit('created')
      close()
    } else {
      toast.add({
        title: t('toast.error'),
        description: response.error || t('toast.failedToCreateSite'),
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: t('toast.error'),
      description: err.message || t('toast.failedToCreateSite'),
      color: 'red'
    })
  } finally {
    isCreating.value = false
  }
}

// Reset form when modal opens
watch(isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>
