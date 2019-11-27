/**
 * 全局配置文件
 */
export default {
  // 网站标题
  title: 'RCDCore',
  // 网站简写
  subtitle: 'R',
  // 配置主键,目前用于存储
  key: 'RCDCore',
  // 首页文字
  indexTitle: 'RCDCore Front Boost',
  // 客户端id
  clientId: 'RCDCore',
  // 客户端密钥
  clientSecret: 'rcore_secret',
  // 是否开启租户模式
  tenantMode: false,
  // 锁屏页路由路径
  lockPage: '/lock',
  // 令牌有效期（单位？）
  tokenTime: 3000,
  // http的status默认放行不用统一处理的,
  statusWhiteList: [],
  // 配置首页不可关闭
  firstPageClosable: false,
  firstPage: {
    label: '首页',
    value: '/',
    params: {},
    query: {},
    group: [],
    close: false
  },
  // 配置菜单的属性
  menu: {
    iconDefault: 'check-circle',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  },
  // 流程设计器地址
  flowDesignUrl: 'http://localhost:9999'
}
