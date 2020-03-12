import Vue from 'vue'
import './plugins/ant-design-vue.js'
import axios from '@/rcore-axios'
import router from './router'
import store from './store'
import { baseUrl } from '@/config/env'

import '@/router/interceptor/auth-interceptor'
import '@/router/interceptor/keep-alive-destroyer'
import './record-error'
import BasicContainer from '@/components/basic-container/BasicContainer'
import App from './App.vue'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

// mock
import '@/mockApi/news/news-mock.js'

Vue.use(contentmenu)

// 注册全局容器
Vue.component('basicContainer', BasicContainer)

Vue.filter('textClip', function (value, clipNum) {
  if (!value) return ''
  value = value.toString()
  if (value.length < clipNum) {
    return value
  }
  return value.substring(0, clipNum) + '...'
})

Vue.prototype.$http = axios
Vue.prototype.$baseUrl = baseUrl

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
