/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * needToken是否需要token
 */

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { serialize } from '@/util/util'
import { getCsrfToken, getToken } from '@/util/auth'
import { baseUrl } from '@/config/env'
import { getMessageFromHttpStatusCode } from '@/util/http-status-message'

axios.defaults.timeout = 10000
// 返回其他状态码
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 400
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
axios.defaults.baseURL = baseUrl
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

const rcdAxios = axios.create()

// HTTP request拦截
rcdAxios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {})
  const isToken = meta.isToken === false

  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  if (config.method !== 'get' && config.method !== 'option' && getCsrfToken()) {
    config.headers['XSRF-TOKEN'] = getCsrfToken()
  }

  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data)
  }
  return config
}, error => {
  return Promise.reject(error)
})

// HTTP response拦截
rcdAxios.interceptors.response.use(res => {
  NProgress.done()
  return res
}, error => {
  NProgress.done()

  const res = error.response
  const { status } = res
  let message = res.headers['x-error-message']
  if (message) {
    message = decodeURIComponent(message)
  }

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
          return rcdAxios.request(res.config)
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
  }
  return Promise.reject(error)
})

export default rcdAxios
