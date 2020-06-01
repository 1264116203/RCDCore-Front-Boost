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
  // 配置首页不可关闭
  firstPageCloseable: false,
  homepageTab: {
    key: '1',
    label: '首页',
    path: '/main/home',
    params: {},
    query: {},
    group: [],
    closeable: false
  },
  // 配置菜单的属性
  menu: {
    iconDefault: 'check-circle'
  },
  // 流程设计器地址
  flowDesignUrl: 'http://localhost:9999',
  // 是否启用WebSocket消息
  wsNotificationEnabled: false,
  // 消息网关host
  notificationGatewayHost: '172.25.34.241:8088'
}
