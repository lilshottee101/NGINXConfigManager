<template>
  <NuxtLink :to="props.link" class="block">
    <UCard class="hover:ring-2 hover:ring-primary transition-all cursor-pointer">
      <div class="flex items-center gap-3">
        <UBadge :color="props.status ? 'green' : 'gray'" variant="soft">
          {{ props.status ? $t('active') : $t('inactive') }}
        </UBadge>
        <p class="font-medium text-base truncate flex-1">{{ props.text }}</p>
        <UIcon name="i-lucide-chevron-right" class="text-gray-400 flex-shrink-0" />
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  link: String,
  status: Boolean,
  text: String
})
</script>
