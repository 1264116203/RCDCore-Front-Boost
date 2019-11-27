import Vue from 'vue'
import './plugins/ant-design-vue.js'
import axios from '@/rcore-axios'
import router from './router'
import store from './store'
import { baseUrl } from '@/config/env'

import '@/router/interceptor/auth-interceptor'
import './record-error'
// import './view-state-cache'

import BasicContainer from '@/components/basic-container/BasicContainer'
import App from './App.vue'

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

axios.baseUrl = baseUrl
Vue.prototype.$http = axios
Vue.prototype.$baseUrl = baseUrl

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
