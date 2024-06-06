import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: 'user',
  state: ()=>({
    token: getToken(),
    username:'',
    password:'',
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  }),
  actions: {
    setUsername(username){
      this.username = username;
    },
    setPassword(password){
      this.password = password;
    },
    // 登录
    Login() {
      const username = this.username.trim()
      const password = this.password
      return new Promise((resolve, reject) => {
        login(username, password).then(res => {
          setToken(res.data)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          let avatar = user.avatar;
          if (user.avatar.trim().toLowerCase().substring(0, 4) != "http") {
            avatar = (user.avatar == "" || user.avatar == null) ? "/demo/images/avatar/amyelsner.png" : import.meta.env.VITE_BASE_API + user.avatar;
          }

          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
})

