// 配置编译环境和线上环境之间的切换

let baseUrl = ''
let codeUrl = `${baseUrl}/code`

const env = process.env
if (env.NODE_ENV === 'development') {
  baseUrl = '' // 开发环境地址
} else if (env.NODE_ENV === 'production') {
  baseUrl = '' // 生产环境地址
} else if (env.NODE_ENV === 'test') {
  baseUrl = '' // 测试环境地址
}

const ACTION_TYPE = {
  CREATION: 'creation',
  UPDATE: 'update',
  DETAIL: 'detail'
}

export {
  baseUrl,
  codeUrl,
  env,
  ACTION_TYPE
}
