import handleNotifications from './callbacks/pushing-notification-callback'

const routes = {
  'pushing_notification': handleNotifications
}

export function handle(msgObj) {
  for (const key of Object.keys(routes)) {
    if (msgObj.messageType === key) {
      routes[key](msgObj)
    }
  }
}
