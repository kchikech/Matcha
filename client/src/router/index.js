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
import UserProfile from '../components/UserProfile'
import Discover from '../components/Discover'
import NotFound from '../components/NotFound'

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
      component: Search,
      props: route => ({
        data: {
          gender: route.query.gender,
          location: route.query.location,
          min: route.query.min,
          max: route.query.max
        }
      })
    },
    {
      name: 'userprofile',
      path: '/user/:id',
      component: UserProfile
    },
    {
      name: 'discover',
      path: '/discover',
      component: Discover
    },
    {
      path: '/404',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
