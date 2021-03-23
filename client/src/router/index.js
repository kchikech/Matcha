import Vue from 'vue'
import VueRessource from 'vue-resource'
import Router from 'vue-router'
import Users from '../components/Users'
import Register from '../components/Register'
import Login from '../components/Login'
import Forgot from '../components/Forgot'
import Recover from '../components/Recover'
import Settings from '../components/Settings'
import Notifications from '../components/Notifications'
import Messenger from '../components/Messenger'
import Search from '../components/Search'

Vue.use(Router)
Vue.use(VueRessource)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Users',
      component: Users
    },
    {
      path: '/register',
      name: '',
      component: Register
    },
    {
      path: '/login',
      name: '',
      component: Login
    },
    {
      path: '/forgot',
      name: '',
      component: Forgot
    },
    {
      path: '/recover',
      name: '',
      component: Recover
    },
    {
      path: '/settings',
      name: '',
      component: Settings
    },
    {
      path: '/notifications',
      name: '',
      component: Notifications
    },
    {
      path: '/chat',
      name: '',
      component: Messenger
    },
    {
      path: '/search',
      name: '',
      component: Search
    }
  ]
})
