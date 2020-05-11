export default function getHandleButtonName(type) {
  switch (type) {
    case 'demo':
      return '处理Demo命令'
    case 'demo-cmd':
      return '打开界面并处理'
    default:
      return '收到'
  }
}
