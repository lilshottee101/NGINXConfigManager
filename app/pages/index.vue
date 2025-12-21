<template>
  <UPage>
    <UPageBody class="flex items-center justify-center py-4">
      <div class="text-center space-y-6 max-w-2xl">
        <div class="space-y-3">
          <UIcon name="i-lucide-server" class="w-24 h-24 mx-auto text-primary opacity-80" />
          <h1 class="text-4xl font-bold">{{ $t('page.home.title') }}</h1>
          <p class="text-xl text-muted">
            {{ $t('page.home.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <UCard class="text-left">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-file-cog" class="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold mb-1">{{ $t('page.home.siteConfigurations') }}</h3>
                <p class="text-sm text-muted">{{ $t('page.home.siteConfigurationsDesc') }}</p>
              </div>
            </div>
          </UCard>

          <UCard class="text-left">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-shield-check" class="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold mb-1">{{ $t('page.home.sslCertificates') }}</h3>
                <p class="text-sm text-muted">{{ $t('page.home.sslCertificatesDesc') }}</p>
              </div>
            </div>
          </UCard>

          <UCard class="text-left">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-gauge" class="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold mb-1">{{ $t('page.home.liveTesting') }}</h3>
                <p class="text-sm text-muted">{{ $t('page.home.liveTestingDesc') }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <div class="pt-4">
          <p class="text-sm text-muted">{{ $t('page.home.getStarted') }}</p>
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>
<script setup lang="ts">
</script>
