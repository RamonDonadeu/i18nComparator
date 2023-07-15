export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "nuxt-quasar-ui",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  imports: {
    dirs: ["./stores"],
  },

  pinia: {
    autoImports: ["defineStore", "acceptHMRUpdate"],
  },
  quasar: {},
});
