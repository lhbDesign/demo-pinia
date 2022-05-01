import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router';
import piniaPluginPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPluginPersist)
const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');
