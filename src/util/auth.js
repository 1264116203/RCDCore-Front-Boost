import Cookies from 'js-cookie'

const TokenKey = 'access-token'
const RefreshTokenKey = 'refresh-token'
const CsrfTokenKey = 'XSRF-TOKEN'

export function getToken () {
  return Cookies.get(TokenKey)
}
export function getCsrfToken() {
  return Cookies.get(CsrfTokenKey)
}
// export function setToken (token) {
//   return Cookies.set(TokenKey, token)
// }

export function getRefreshToken () {
  return Cookies.get(RefreshTokenKey)
}

// export function setRefreshToken (token) {
//   return Cookies.set(RefreshTokenKey, token)
// }
//
// export function removeToken () {
//   return Cookies.remove(TokenKey)
// }
//
// export function removeRefreshToken () {
//   return Cookies.remove(RefreshTokenKey)
// }
