//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//AntDesign
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';


const app = createApp(App)

app.use(createPinia())
app.use(router)
//AntDesign
app.use(Antd)

app.mount('#app')
