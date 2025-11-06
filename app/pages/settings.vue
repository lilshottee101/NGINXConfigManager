<template>
  <h2>{{ $t('settings') }}</h2>
  <UCard variant="soft">
    <UTabs :items="settingTabs" orientation="vertical">
      <template #apperance>
        <div>
          <p>{{ $t('colorModeLabel') }}</p>
          <UColorModeSelect />
          <p>{{ $t('languageSelectLabel') }}</p>
          <ULocaleSelect
            v-model="locale"
            :locales="Object.values(locales)"
            @update:model-value="setLocale($event)"
          />
        </div>
      </template>
    </Utabs>
  </UCard>
</template>

<script setup lang="ts">
  import type { TabsItem } from '@nuxt/ui'
  import * as locales from '@nuxt/ui/locale'

  const { locale, setLocale } = useI18n()

  const settingsTabs = [
    {
      label: $t('settingTabApperance')
      icon: '',
      slot: 'apperance' as const
    },
    {
      label: $t('settingTabAbout'),
      icon: '',
      slot: 'about' as const
    }
  ] satisfies TabsItem[]

</script>
