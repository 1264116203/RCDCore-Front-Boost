import Vue from 'vue'
import './plugins/ant-design-vue.js'
import { baseUrl } from '@/config/env'
import moment from 'moment'
import axios from '@/rcore-axios'
import store from './store'

import router from './router'
import '@/router/interceptor/auth-interceptor'
import '@/router/interceptor/tab-switching-interceptor'
import '@/router/interceptor/keep-alive-destroyer'
import App from './App.vue'
import BasicContainer from '@/components/basic-container/basic-container'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import '@/assets/styles/custom-styles.less'
import '@/assets/styles/rcdcore-form.less'

// mock
import '@/mock-api/news/news-mock.js'
import { NoHalfTree } from '@/components/rcore'

Vue.use(contentmenu)

// 注册全局容器
Vue.component('basicContainer', BasicContainer)
Vue.component('noHalfTree', NoHalfTree)

Vue.filter('textClip', function (value, clipNum) {
  if (!value) return ''
  value = value.toString()
  if (value.length < clipNum) {
    return value
  }
  return value.substring(0, clipNum) + '...'
})

Vue.filter('momentTime', function (value, pattern = 'YYYY-MM-DD') {
  if (!value) return ''

  return moment(value).format(pattern)
})

Vue.prototype.$http = axios
Vue.prototype.$baseUrl = baseUrl

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
