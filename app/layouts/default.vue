<template>
  <UBanner v-if="wsOpen" color="error" icon="i-lucide-info" :title="$t('wsErrorBanner')" />
  <UHeader>
    <template #title>
      <a>{{ $t('title') }}</a>
    </template>
    <template #right>
      <UDropdownMenu
        arrow
        :items="dropdownItems"
        :content="{
          align: 'center'
        }"
      >
        <UUser
          name="Default User"
          description="Administrator"
          :avatar="{
            alt: 'Default User'
          }"
        />
      </UDropdownMenu>
    </template>
  </UHeader>
  <UPage>
    <template #left>
      <UPageAside>
        <siteList />
      </UPageAside>
    </template>
    <slot/>
  </UPage>
</template>

<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui';
  const nuxtApp = useNuxtApp()

  const dropdownItems = ref<DropdownMenuItem[]>([
    [
      {
        label: "Profile",
        icon: "i-lucide-user"
      }
    ],
    [
      {
        label: "Settings",
        icon: "i-lucide-settings",
        to: "/settings"
      }
    ],
    [
      {
        label: "Logout",
        icon: "i-lucide-log-out",
        color: "error"
      }
    ]
  ])

  const wsOpen = computed(() => {
    return nuxtApp.$webSocket?.status.value != 'OPEN'
  })
</script>
