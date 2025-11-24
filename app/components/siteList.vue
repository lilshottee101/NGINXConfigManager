<template>
  <UCard variant="subtle" class="">
    <template #header>
      <UInput icon="i-lucide-search" size="md" variant="outline" placeholder="Search..." />
    </template>

    <site
      v-for="x in 5"
      text="Test"
      link="/site/test34"
      status=True
    />

    <template #footer>
      <UPagination v-model:page="page" :total=100 />
    </template>
  </UCard>
</template>

<script setup>
  const page = ref(1)
</script>
