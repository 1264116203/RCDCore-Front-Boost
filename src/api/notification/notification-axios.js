import Vue from 'vue'
import store from '@/store'
import axios from 'axios'
import website from '@/config/website'
import NProgress from 'nprogress'
import * as qs from 'qs'
import router from '@/router'
import { getMessageFromHttpStatusCode } from '@/util/http-status-message'

const notificationAxios = axios.create({
  baseURL: 'http://' + website.notificationGatewayHost + '/message',
  timeout: 10000
})

// HTTP request拦截
notificationAxios.interceptors.request.use(config => {
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
notificationAxios.interceptors.response.use(res => {
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
    // 如果返回内容为"invalid refresh token"，说明此时已经执行过刷新令牌重请求了
    // 但因为刷新令牌已失效，故只能跳回登录页
    if (res.data && res.data.refreshToken === 'invalid refresh token') {
      // 如果刷新token已失效，则跳转到登录页面
      return store.dispatch('user/logout')
        .then(() => router.push({ path: '/login' }))
    } else {
      // 其他情况下，说明还没开始换取refreshToken
      // 如果返回体内容为"invalid jwt token"，则说明服务器认定JWT令牌已失效，此时应发请求换取新的JWT令牌
      // 只有存在refreshToken时，再提交令牌重刷
      const refreshToken = store.state.user.refreshToken
      if (res.data && res.data === 'invalid jwt token' && refreshToken) {
        return store.dispatch('user/refreshToken').then(() => {
          return notificationAxios.request(res.config)
        })
      }
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

export default notificationAxios
