/**
 * 全局配置文件
 */
export default {
  title: 'RCDCore',
  logo: 'S',
  key: 'RCDCore', // 配置主键,目前用于存储
  indexTitle: 'RCDCore Front Boost',
  clientId: 'RCDCore', // 客户端id
  clientSecret: 'rcore_secret', // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  lockPage: '/lock',
  tokenTime: 3000,
  // http的status默认放行不用统一处理的,
  statusWhiteList: [],
  // 配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: '首页',
    value: '/wel/index',
    params: {},
    query: {},
    group: [],
    close: false
  },
  // 配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
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
