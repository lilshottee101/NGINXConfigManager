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
  useApp.$webSocket.send(JSON.stringify(request));
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
