<template>
  <NuxtLink :to="props.link">
    <UCard>
      <UBadge>{{ props.status ? $t('active') : $t('inactive') }}</UBadge>
      <p>{{ props.text }}</p>
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
