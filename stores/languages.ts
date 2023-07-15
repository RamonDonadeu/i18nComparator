export const useStore = defineStore("languages", {
  persist: {
    storage: persistedState.localStorage,
  },
  state: () => ({
    languages: [],
  }),

  actions: {
    setLanguages(languages: never[]) {
      this.languages = languages;
    },
  },
});
