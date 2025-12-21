<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <div>
        <h3 class="text-2xl font-bold">SSL/TLS Certificates</h3>
        <p class="text-muted text-sm mt-1">Manage Let's Encrypt and custom SSL certificates</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <UButton label="Create Certificate" icon="i-lucide-plus" color="primary" @click="showCreateModal" />
        <UButton label="Upload Custom" icon="i-lucide-upload" variant="outline" @click="showUploadModal" />
        <UButton label="Refresh" icon="i-lucide-refresh-cw" variant="outline" :loading="isLoading"
          @click="loadCertificates" />
      </div>
    </div>

    <div v-if="isLoading && certificates.length === 0" class="text-center py-16">
      <USpinner size="lg" />
      <p class="mt-4 text-muted font-medium">Loading certificates...</p>
    </div>

    <div v-else-if="certificates.length === 0" class="text-center py-16">
      <UIcon name="i-lucide-shield-off" class="w-16 h-16 mx-auto mb-4 text-muted opacity-50" />
      <h4 class="font-semibold text-lg mb-2">No Certificates Found</h4>
      <p class="text-muted mb-6">Get started by creating a Let's Encrypt certificate or uploading a custom one</p>
      <div class="flex gap-2 justify-center">
        <UButton label="Create Certificate" icon="i-lucide-plus" color="primary" @click="showCreateModal" />
        <UButton label="Upload Custom" icon="i-lucide-upload" variant="outline" @click="showUploadModal" />
      </div>
    </div>

    <div v-else class="space-y-3">
      <UCard v-for="cert in certificates" :key="cert.name" variant="soft" class="hover:ring-1 hover:ring-primary/50 transition-all">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 space-y-3">
            <div class="flex items-center gap-3 flex-wrap">
              <h4 class="font-bold text-lg">{{ cert.name }}</h4>
              <UBadge :color="cert.valid ? 'green' : 'red'" variant="soft" size="md">
                <UIcon :name="cert.valid ? 'i-lucide-check-circle' : 'i-lucide-alert-circle'" class="w-4 h-4 mr-1" />
                {{ cert.valid ? 'Valid' : 'Expired' }}
              </UBadge>
              <UBadge v-if="cert.daysUntilExpiry !== undefined" :color="cert.daysUntilExpiry < 30 ? 'orange' : 'gray'" variant="soft">
                <UIcon name="i-lucide-clock" class="w-4 h-4 mr-1" />
                {{ cert.daysUntilExpiry }} days left
              </UBadge>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <UIcon name="i-lucide-globe" class="w-4 h-4 mt-0.5 flex-shrink-0 text-muted" />
                <div class="flex flex-wrap gap-1.5">
                  <UBadge v-for="domain in cert.domains" :key="domain" variant="soft" size="sm" color="neutral">
                    {{ domain }}
                  </UBadge>
                </div>
              </div>
              <div class="flex items-center gap-2 text-muted">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 flex-shrink-0" />
                <span>Expires: <span class="font-medium">{{ cert.expiry }}</span></span>
              </div>
              <div class="text-xs font-mono space-y-1 text-muted bg-muted/20 p-2 rounded">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-file-key" class="w-3 h-3 flex-shrink-0" />
                  <span class="truncate">{{ cert.certPath }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-key" class="w-3 h-3 flex-shrink-0" />
                  <span class="truncate">{{ cert.keyPath }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2 flex-shrink-0">
            <UButton icon="i-lucide-refresh-cw" label="Renew" color="primary" variant="soft" size="sm"
              :loading="renewingCerts.has(cert.name)" @click="handleRenew(cert.name)" />
            <UButton icon="i-lucide-trash-2" label="Delete" color="red" variant="soft" size="sm"
              :loading="deletingCerts.has(cert.name)" @click="handleDelete(cert.name)" />
          </div>
        </div>
      </UCard>
    </div>

    <UModal v-model:open="isCreateModalOpen" title="Create New Certificate" :ui="{ footer: 'justify-end' }">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Email (optional)">
            <UInput v-model="newCert.email" placeholder="admin@example.com" />
          </UFormField>

          <UFormField label="Domains">
            <div class="space-y-2">
              <div v-for="(domain, index) in newCert.domains" :key="index" class="flex gap-2">
                <UInput v-model="newCert.domains[index]" placeholder="example.com" class="flex-1" />
                <UButton v-if="newCert.domains.length > 1" icon="i-lucide-trash" color="red" variant="soft"
                  @click="removeDomain(index)" />
              </div>
              <UButton label="Add Domain" icon="i-lucide-plus" variant="outline" size="sm" @click="addDomain" />
            </div>
          </UFormField>
        </div>
      </template>

      <template #footer>
        <UButton label="Cancel" variant="outline" @click="isCreateModalOpen = false" />
        <UButton label="Create" color="primary" :loading="isCreating" :disabled="!canCreate"
          @click="handleCreate" />
      </template>
    </UModal>

    <UModal v-model:open="isUploadModalOpen" title="Upload Custom Certificate" :ui="{ footer: 'justify-end' }">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Certificate Name">
            <UInput v-model="uploadCert.name" placeholder="my-custom-cert" />
          </UFormField>

          <UFormField label="Certificate (PEM)">
            <div class="space-y-2">
              <div class="flex gap-2">
                <input
                  ref="certFileInput"
                  type="file"
                  accept=".pem,.crt,.cer"
                  class="hidden"
                  @change="handleCertFileUpload"
                />
                <UButton
                  icon="i-lucide-upload"
                  label="Upload File"
                  variant="outline"
                  size="sm"
                  @click="certFileInput?.click()"
                />
              </div>
              <UTextarea v-model="uploadCert.certContent" :rows="5" placeholder="-----BEGIN CERTIFICATE-----" />
            </div>
          </UFormField>

          <UFormField label="Private Key (PEM)">
            <div class="space-y-2">
              <div class="flex gap-2">
                <input
                  ref="keyFileInput"
                  type="file"
                  accept=".pem,.key"
                  class="hidden"
                  @change="handleKeyFileUpload"
                />
                <UButton
                  icon="i-lucide-upload"
                  label="Upload File"
                  variant="outline"
                  size="sm"
                  @click="keyFileInput?.click()"
                />
              </div>
              <UTextarea v-model="uploadCert.keyContent" :rows="5" placeholder="-----BEGIN PRIVATE KEY-----" />
            </div>
          </UFormField>

          <UFormField label="Certificate Chain (PEM, optional)">
            <div class="space-y-2">
              <div class="flex gap-2">
                <input
                  ref="chainFileInput"
                  type="file"
                  accept=".pem,.crt,.cer"
                  class="hidden"
                  @change="handleChainFileUpload"
                />
                <UButton
                  icon="i-lucide-upload"
                  label="Upload File"
                  variant="outline"
                  size="sm"
                  @click="chainFileInput?.click()"
                />
              </div>
              <UTextarea v-model="uploadCert.chainContent" :rows="5" placeholder="-----BEGIN CERTIFICATE-----" />
            </div>
          </UFormField>
        </div>
      </template>

      <template #footer>
        <UButton label="Cancel" variant="outline" @click="isUploadModalOpen = false" />
        <UButton label="Upload" color="primary" :loading="isUploading" :disabled="!canUpload"
          @click="handleUpload" />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const nginxApi = useNginxApi()
const toast = useToast()

interface Certificate {
  name: string
  domains: string[]
  expiry: string
  certPath: string
  keyPath: string
  chainPath: string
  fullchainPath: string
  valid: boolean
  daysUntilExpiry?: number
}

const certificates = ref<Certificate[]>([])
const isLoading = ref(false)
const renewingCerts = ref(new Set<string>())
const deletingCerts = ref(new Set<string>())

const isCreateModalOpen = ref(false)
const isCreating = ref(false)
const newCert = ref({
  email: '',
  domains: ['']
})

const isUploadModalOpen = ref(false)
const isUploading = ref(false)
const uploadCert = ref({
  name: '',
  certContent: '',
  keyContent: '',
  chainContent: ''
})

const certFileInput = ref<HTMLInputElement>()
const keyFileInput = ref<HTMLInputElement>()
const chainFileInput = ref<HTMLInputElement>()

const canCreate = computed(() => {
  return newCert.value.domains.some(d => d.trim().length > 0)
})

const canUpload = computed(() => {
  return uploadCert.value.name.trim().length > 0 &&
    uploadCert.value.certContent.trim().length > 0 &&
    uploadCert.value.keyContent.trim().length > 0
})

async function loadCertificates() {
  isLoading.value = true
  try {
    certificates.value = await nginxApi.getCertificates()
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to load certificates',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

function showCreateModal() {
  newCert.value = { email: '', domains: [''] }
  isCreateModalOpen.value = true
}

function showUploadModal() {
  uploadCert.value = { name: '', certContent: '', keyContent: '', chainContent: '' }
  isUploadModalOpen.value = true
}

async function handleCertFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  try {
    const content = await file.text()
    uploadCert.value.certContent = content

    if (!uploadCert.value.name) {
      uploadCert.value.name = file.name.replace(/\.(pem|crt|cer)$/, '')
    }
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: `Failed to read certificate file: ${err.message}`,
      color: 'red'
    })
    uploadCert.value.certContent = ''
  } finally {
    target.value = ''
  }
}

async function handleKeyFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  try {
    const content = await file.text()
    uploadCert.value.keyContent = content
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: `Failed to read key file: ${err.message}`,
      color: 'red'
    })
    uploadCert.value.keyContent = ''
  } finally {
    target.value = ''
  }
}

async function handleChainFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  try {
    const content = await file.text()
    uploadCert.value.chainContent = content
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: `Failed to read chain file: ${err.message}`,
      color: 'red'
    })
    uploadCert.value.chainContent = ''
  } finally {
    target.value = ''
  }
}

function addDomain() {
  newCert.value.domains.push('')
}

function removeDomain(index: number) {
  newCert.value.domains.splice(index, 1)
}

async function handleCreate() {
  isCreating.value = true
  try {
    const domains = newCert.value.domains.filter(d => d.trim().length > 0)
    const email = newCert.value.email.trim() || undefined

    const response = await nginxApi.createCertificate(domains, email)

    if (response.success) {
      toast.add({
        title: 'Success',
        description: 'Certificate created successfully',
        color: 'green'
      })
      isCreateModalOpen.value = false
      await loadCertificates()
    } else {
      toast.add({
        title: 'Error',
        description: response.error || 'Failed to create certificate',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to create certificate',
      color: 'red'
    })
  } finally {
    isCreating.value = false
  }
}

async function handleUpload() {
  isUploading.value = true
  try {
    const response = await nginxApi.uploadCertificate(
      uploadCert.value.name,
      uploadCert.value.certContent,
      uploadCert.value.keyContent,
      uploadCert.value.chainContent || undefined
    )

    if (response.success) {
      toast.add({
        title: 'Success',
        description: 'Certificate uploaded successfully',
        color: 'green'
      })
      isUploadModalOpen.value = false
      await loadCertificates()
    } else {
      toast.add({
        title: 'Error',
        description: response.error || 'Failed to upload certificate',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to upload certificate',
      color: 'red'
    })
  } finally {
    isUploading.value = false
  }
}

async function handleRenew(certName: string) {
  renewingCerts.value.add(certName)
  try {
    const response = await nginxApi.renewCertificate(certName)

    if (response.success) {
      toast.add({
        title: 'Success',
        description: `Certificate ${certName} renewed successfully`,
        color: 'green'
      })
      await loadCertificates()
    } else {
      toast.add({
        title: 'Error',
        description: response.error || 'Failed to renew certificate',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to renew certificate',
      color: 'red'
    })
  } finally {
    renewingCerts.value.delete(certName)
  }
}

async function handleDelete(certName: string) {
  if (!confirm(`Are you sure you want to delete certificate "${certName}"?`)) {
    return
  }

  deletingCerts.value.add(certName)
  try {
    const response = await nginxApi.deleteCertificate(certName)

    if (response.success) {
      toast.add({
        title: 'Success',
        description: `Certificate ${certName} deleted successfully`,
        color: 'green'
      })
      await loadCertificates()
    } else {
      toast.add({
        title: 'Error',
        description: response.error || 'Failed to delete certificate',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to delete certificate',
      color: 'red'
    })
  } finally {
    deletingCerts.value.delete(certName)
  }
}

onMounted(() => {
  loadCertificates()
})
</script>
