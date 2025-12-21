<template>
  <UBanner v-if="wsOpen" color="error" icon="i-lucide-info" :title="$t('wsErrorBanner')" />
  <UHeader>
    <template #title>
      <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <UIcon name="i-lucide-server" class="w-8 h-8 text-primary" />
        <span class="font-bold text-xl">{{ $t('title') }}</span>
      </NuxtLink>
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
          :name="$t('layout.defaultUser')"
          :description="$t('layout.administrator')"
          :avatar="{
            alt: $t('layout.defaultUser')
          }"
        />
      </UDropdownMenu>
    </template>
  </UHeader>
  <UPage>
    <template #left>
      <UPageAside class="pl-4 pr-2 py-4 h-full">
        <siteList class="h-full" />
      </UPageAside>
    </template>
    <div class="pr-4 h-full">
      <slot/>
    </div>
  </UPage>
</template>

<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui';
  const { t } = useI18n()
  const nuxtApp = useNuxtApp()

  const dropdownItems = ref<DropdownMenuItem[]>([
    [
      {
        label: t('layout.profile'),
        icon: "i-lucide-user"
      }
    ],
    [
      {
        label: t('settings'),
        icon: "i-lucide-settings",
        to: "/settings"
      }
    ],
    [
      {
        label: t('layout.logout'),
        icon: "i-lucide-log-out",
        color: "error"
      }
    ]
  ])

  const wsOpen = computed(() => {
    return nuxtApp.$webSocket?.status.value != 'OPEN'
  })
</script>
