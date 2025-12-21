<template>
  <UCard variant="subtle" class="h-[calc(100vh-5rem)] flex flex-col">
    <template #header>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">{{ $t('siteList.title') }}</h3>
          <UButton
            icon="i-lucide-plus"
            size="xs"
            color="primary"
            variant="soft"
            :title="$t('siteList.createNewSite')"
            @click="showCreateModal = true"
          />
        </div>
        <UInput v-model="searchQuery" icon="i-lucide-search" size="md" variant="outline" :placeholder="$t('placeholder.searchSites')" />
      </div>
    </template>

    <div class="space-y-2 flex-1 overflow-y-auto min-h-0 pb-2">
      <site v-for="site in paginatedSites" :key="site.id" :text="site.name" link="/site"
        :status="site.enabled" @click="handleSiteClick(site)" />

      <div v-if="paginatedSites.length === 0" class="text-center py-12 text-gray-500">
        <UIcon name="i-lucide-search-x" class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p class="font-medium">{{ $t('siteList.noSitesFound') }}</p>
      </div>
    </div>

    <template #footer>
      <UPagination v-model:page="page" :total="totalItems" :items-per-page="itemsPerPage" />
    </template>
  </UCard>

  <CreateSiteModal
    v-model:open="showCreateModal"
    @created="handleSiteCreated"
  />
</template>

<script setup>
import { useSitesStore } from '~/stores/sitesStore'

const { t } = useI18n()
const nginxApi = useNginxApi()
const toast = useToast()

const sitesStore = useSitesStore()
const page = ref(1)
const itemsPerPage = ref(5)
const searchQuery = ref('')
const showCreateModal = ref(false)

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

async function handleSiteCreated() {
  try {
    const sites = await nginxApi.getSites()
    if (Array.isArray(sites)) {
      sitesStore.setSites(sites)

      toast.add({
        title: t('toast.sitesRefreshed'),
        description: t('toast.siteListUpdated'),
        color: 'green'
      })
    }
  } catch (err) {
    console.error('Failed to refresh sites:', err)
  }
}
</script>
