import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Tooltip from 'primevue/tooltip'
import 'primevue/resources/themes/lara-dark-blue/theme.css'

axios.defaults.baseURL = import.meta.env.VITE_REMOTE_API

const app = createApp(App)

library.add(fas)
app.component('fa-fa', FontAwesomeIcon)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(PrimeVue)
app.directive('tooltip', Tooltip)

app.mount('#app')
