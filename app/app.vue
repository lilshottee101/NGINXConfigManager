<script setup>
import { useSitesStore } from '~/stores/sitesStore'

const sitesStore = useSitesStore()
const nginxApi = useNginxApi()

onMounted(async () => {
  console.log("Fetching initial sites...")
  await fetchSites()
})

async function fetchSites() {
  try {
    const sites = await nginxApi.getSites()
    sitesStore.setSites(sites)
    console.log('Initial sites loaded:', sites)
  } catch (err) {
    console.error('Failed to fetch sites:', err)
  }
}
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain>
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
