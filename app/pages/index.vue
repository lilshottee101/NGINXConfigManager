<template>
</template>
<script setup lang="ts">
const siteTest = 5
const useApp = useNuxtApp();
const tester = {
  request: "getSites"
}
function test() {
  useApp.$webSocket.send(JSON.stringify(tester));
}
</script>
