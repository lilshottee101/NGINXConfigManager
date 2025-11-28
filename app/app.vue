<script setup>
onMounted(() => {
  console.log("test")
  getSites()
})

const useApp = useNuxtApp();
function getSites() {

  const request = {
    request: "getSites"
  }
  const sites = useApp.$webSocket.send(JSON.stringify(request));
  console.log(sites)
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
