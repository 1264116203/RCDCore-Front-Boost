import handleNotifications from './callbacks/pushing-notification-callback'
import defaultCallback from './callbacks/default-callback'

const routes = {
  'pushing_notification': handleNotifications
}

export function handle(msgObj) {
  let handled = false
  for (const key of Object.keys(routes)) {
    if (msgObj.messageType === key) {
      routes[key](msgObj)
      handled = true
      break
    }
  }
  if (!handled) {
    defaultCallback(msgObj)
  }
}
