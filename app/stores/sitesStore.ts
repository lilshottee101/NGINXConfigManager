import { defineStore } from 'pinia'

export const useSitesStore = defineStore('sites', {
  state: () => ({
    sites: [],
    activeSiteId: null
  }),
  getters: {
    enabledSites: (state) => {
      return state.sites.filter(site => site.enabled)
    },
    activeSite: (state) => {
      if (state.sites.length < 1) return null
      if (!state.activeSiteId) {
        state.activeSiteId = state.sites[0].id
      }
      return state.sites.find(site => site.id === state.activeSiteId) || null
    }
  },
  actions: {
    addSite(name, enabled = true, contents) {
      const newSite = {
        id: Date.now(),
        name,
        enabled,
        contents
      }
      this.sites.push(newSite)
      return newSite
    },
    setSites(sitesData) {
      this.sites = sitesData.map(site => ({
        id: site.site,
        name: site.site,
        enabled: site.active,
        contents: site.content
      }))
    },
    setActiveSite(siteId) {
      this.activeSiteId = siteId
    },
    clearActiveSite() {
      this.activeSiteId = null
    }
  }
})
