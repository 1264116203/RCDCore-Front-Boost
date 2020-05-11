import defaultHandler, { handleDemoCmdMessage, handleDemoMessage } from '@/websocket-msg/handlers/default-handler'

const routes = {
  'demo': handleDemoMessage,
  'demo-cmd': handleDemoCmdMessage
}

export function handle(msgObj) {
  let handled = false
  for (const key of Object.keys(routes)) {
    if (msgObj.type === key) {
      routes[key](msgObj)
      handled = true
      break
    }
  }
  if (!handled) {
    defaultHandler(msgObj)
  }
}
