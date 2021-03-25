// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'
import Vuex from 'vuex'
import { store } from './store/store'
import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'

Vue.use(Vuex)

Vue.config.productionTip = false

const SocketInstance = io(`${process.env.URL}`)

Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketInstance,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
