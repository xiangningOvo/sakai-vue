import Cookies from 'js-cookie'

const TokenKey = import.meta.env.VITE_TOKEN_KEY

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
