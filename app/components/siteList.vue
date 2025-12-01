<template>
  <UCard variant="subtle" class="">
    <template #header>
      <UInput v-model="searchQuery" icon="i-lucide-search" size="md" variant="outline" placeholder="Search sites..." />
    </template>

    <site v-for="site in paginatedSites" :key="site.id" :text="site.name" link="/site"
      :status="site.enabled" @click="handleSiteClick(site)" />

    <div v-if="paginatedSites.length === 0" class="text-center py-8 text-gray-500">
      No sites found
    </div>

    <template #footer>
      <UPagination v-model:page="page" :total="totalItems" :items-per-page="itemsPerPage" />
    </template>
  </UCard>
</template>

<script setup>
import { useSitesStore } from '~/stores/sitesStore'

const sitesStore = useSitesStore()
const page = ref(1)
const itemsPerPage = ref(5)
const searchQuery = ref('')

const filteredSites = computed(() => {
  if (!searchQuery.value) {
    return sitesStore.sites
  }

  const query = searchQuery.value.toLowerCase()
  return sitesStore.sites.filter(site =>
    site.name.toLowerCase().includes(query)
  )
})

const totalItems = computed(() => filteredSites.value.length)

const paginatedSites = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSites.value.slice(start, end)
})

watch(searchQuery, () => {
  page.value = 1
})
function handleSiteClick(site) {
  sitesStore.setActiveSite(site.id)
}
</script>
