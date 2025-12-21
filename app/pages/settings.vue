<template>
  <UPage>
    <UPageBody class="py-4">
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold">{{ $t('settings') }}</h1>
          <p class="text-muted mt-1">{{ $t('page.settings.subtitle') }}</p>
        </div>

        <UCard variant="soft">
          <UTabs :items="settingTabs" orientation="vertical">
            <template #apperance>
              <div class="space-y-6 p-6">
                <div class="space-y-3">
                  <label class="text-sm font-semibold">{{ $t('colorModeLabel') }}</label>
                  <UColorModeSelect />
                </div>
                <div class="space-y-3">
                  <label class="text-sm font-semibold">{{ $t('languageSelectLabel') }}</label>
                  <ULocaleSelect v-model="locale" :locales="Object.values(locales)" @update:model-value="setLocale($event)" />
                </div>
              </div>
            </template>
            <template #certificates>
              <div class="p-6">
                <CertificateManager />
              </div>
            </template>
          </UTabs>
        </UCard>
      </div>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import * as locales from '@nuxt/ui/locale'

const { locale, setLocale, t } = useI18n()

const settingTabs = [
  {
    label: t('settingTabApperance'),
    icon: '',
    slot: 'apperance' as const
  },
  {
    label: t('settingTabCertificates'),
    icon: 'i-lucide-shield-check',
    slot: 'certificates' as const
  },
  {
    label: t('settingTabAbout'),
    icon: '',
    slot: 'about' as const
  }
] satisfies TabsItem[]

</script>
