/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * needToken是否需要token
 */
import { Base64 } from 'js-base64'
import NProgress from 'nprogress' // progress bar
import Antd from 'ant-design-vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { serialize } from '@/util/util'
import { getToken } from '@/util/auth'
import website from '@/config/website'

axios.defaults.timeout = 10000
// 返回其他状态码
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 300
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

// HTTP request拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {})
  const isToken = meta.isToken === false

  config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`
  if (getToken() && !isToken) {
    config.headers['Blade-Auth'] = 'bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
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
axios.interceptors.response.use(res => {
  NProgress.done()
  const status = res.data.code || 200
  const statusWhiteList = website.statusWhiteList || []
  const message = res.data.msg || '未知错误'

  // 如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) {
    return Promise.reject(res)
  }
  // 如果是401则跳转到登录页面
  if (status === 401) {
    store.dispatch('user/clearAllAuthInfos')
      .then(() => router.push({ path: '/login' }))
  }

  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
    Antd.message.error({ content: message })
    return Promise.reject(new Error(message))
  }
  return res
}, error => {
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default axios
