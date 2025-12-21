<template>
  <UModal
    :title="$t('modal.configValid')"
    :ui="{ body: 'space-y-4', footer: 'justify-end' }"
  >
    <template #body>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-check" class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p class="text-sm text-gray-600">{{ $t('modal.configValidDescription') }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        :label="$t('button.ok')"
        color="green"
        @click="emit('close')"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()
</script>
