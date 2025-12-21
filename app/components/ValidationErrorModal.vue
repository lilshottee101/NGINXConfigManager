<template>
  <UModal
    :title="$t('modal.configTestFailed')"
    :ui="{ body: 'space-y-4', footer: 'justify-end' }"
  >
    <template #body>
      <div>
        <p class="text-sm text-gray-600">{{ error }}</p>
      </div>
      <div class="bg-gray-900 p-4 rounded-md overflow-auto max-h-64">
        <pre class="text-xs text-red-400">{{ validationError || error }}</pre>
      </div>
    </template>

    <template #footer>
      <UButton
        :label="$t('button.cancel')"
        variant="outline"
        @click="emit('close')"
      />
      <UButton
        :label="$t('button.overrideAndSave')"
        color="red"
        @click="handleOverride"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: string
  validationError?: string
  onOverride: () => Promise<void>
}>()

const emit = defineEmits<{
  close: []
}>()

async function handleOverride() {
  await props.onOverride()
  emit('close')
}
</script>
