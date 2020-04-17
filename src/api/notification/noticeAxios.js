import Vue from 'vue'
import store from '@/store'
import axios from 'axios'
import website from '@/config/website'
import NProgress from 'nprogress'
import * as qs from 'qs'
import router from '@/router'
import { getMessageFromHttpStatusCode } from '@/util/http-status-message'

const noticeAxios = axios.create({
  baseURL: 'http://' + website.notificationGatewayHost + '/message',
  timeout: 10000
})

// HTTP request拦截
noticeAxios.interceptors.request.use(config => {
  NProgress.start() // start progress bar

  if (store && store.getters && store.getters.token) {
    config.headers['Authorization'] = 'Bearer ' + store.getters.token // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }

  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTTP response拦截
noticeAxios.interceptors.response.use(res => {
  NProgress.done()
  return res
}, (error) => {
  NProgress.done()

  const res = error.response
  const { status } = res
  let message = res.headers['x-error-message']
  if (message) {
    message = decodeURIComponent(message)
  }

  // 如果是401则跳转到登录页面
  if (status === 401) {
    // 只有在token换取机制也失效后，再跳到登录页
    if (res.data && res.data.refreshToken === 'invalid refresh token') {
      return store.dispatch('user/logout')
        .then(() => router.push({ path: '/login' }))
    } else {
      return store.dispatch('user/refreshToken').then(() => {
        return noticeAxios.request(res.config)
      })
    }
  }

  if (!message) {
    message = getMessageFromHttpStatusCode(status)
  }
  // 如果请求为非200则默认统一处理
  if (status !== 200) {
    Vue.prototype.$message.error({ content: message, key: 'error_message' })
    return Promise.reject(new Error(message))
  }
  return Promise.reject(new Error(error))
})

export default noticeAxios
