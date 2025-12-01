<template>
  <NuxtLink :to="props.link">
    <UCard>
      <div class="inline-flex gap-2">
        <UBadge>{{ props.status ? $t('active') : $t('inactive') }}</UBadge>
        <p>{{ props.text }}</p>
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
