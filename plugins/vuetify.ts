import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createVuetify } from "vuetify/lib/framework.mjs";

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        components, directives
    })
    nuxtApp.vueApp.use(vuetify)    
})
