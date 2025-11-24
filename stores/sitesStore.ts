import { defineStore } from 'pinia'

export const useSitesStore = defineStore('sites', {
  state: () => ({
    sites: []
  }),

  getters: {
    enabledSites: (state) => {
      return state.sites.filter(site => site.enabled)
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
    }
  }
})
