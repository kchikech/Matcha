<template>
  <!-- <v-app-bar src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"> -->
<nav>
  <v-app-bar text app>
    <v-app-bar-nav-icon v-if="status" class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
    <div v-else style="width:2.5rem;"></div>
    <v-app-bar-title class="text-uppercase grey--text">
    <span class="font-weight-light">Matcha</span>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-layout v-if="status" justify-end>
      <v-menu bottom offset-y v-model="notifMenu" :nudge-width="250">
        <template v-slot:activator="{ on }">
          <v-btn text icon large color="grey" v-on="on"><v-badge overlap :value="!!notifNum" color="primary" class="mx-2" right><template v-slot:badge><span>{{ notifNum }}</span></template><v-icon color="grey">mdi-bell</v-icon></v-badge></v-btn>
        </template>
        <v-list class="grey lighten-5 pa-0">
           <template v-for="(item, i) in notifs">
            <v-list-item :key="i" @click="toUserProfile(item.id_from)">
              <v-list-item-avatar>
                <img :src="getFullPath(item.profile_image)">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="notif_msg">
                  <strong class="notif_username">{{ item.username }}</strong>
                  <span>{{ getNotifMsg(item) }}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon small color="blue lighten-2" class="mr-2">{{ getNotifIcon(item.type) }}</v-icon>
                  <span class="notif_date">{{ formatNotifDate(item) }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item router to="/notifications" class="see_all">
            <v-list-item-title>See all notifications</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu bottom offset-y v-model="msgMenu" :nudge-width="250">
        <template v-slot:activator="{ on }">
          <v-btn text icon large color="grey" v-on="on">
            <v-badge overlap :value="!!newMsgNum" color="primary" class="mx-2" right>
              <template v-slot:badge>
                <span>{{ newMsgNum }}</span>
              </template>
              <v-icon color="grey">mdi-chat</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-list class="grey lighten-5 pa-0 message_list">
          <template v-for="(item, i) in menuConvos">
            <v-list-item :key="i" @click="toUserChat(item)">
              <v-list-item-avatar>
                <img :src="getFullPath(item.profile_image)">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="notif_msg">
                  <v-layout justify-between>
                    <strong class="notif_username">{{ item.username }}</strong>
                    <span class="ml-auto chat_time">{{ formatNotifDate(item) }}</span>
                  </v-layout>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="item.message_from == user.id" class="notif_date">You: </span>
                  <span class="notif_date text-truncate">{{ item.message }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item router to="/chat" class="see_all">
            <v-list-item-title>See all chats</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-layout>
    <div v-if="!status">
      <v-btn text color="grey" router to="/login">Login</v-btn>
      <v-btn text color="grey" router to="/register">Sign Up</v-btn>
    </div>
  </v-app-bar>
  <v-navigation-drawer v-if="status" v-model="drawer" fixed class="primary">
     <v-list>
      <v-list-item>
          <v-layout align-center justify-center v-if="status">
          <v-list-item-avatar><img :src="image"></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="white--text text-capitalize font-weight-light subheading">{{ user.username }}</v-list-item-title>
          </v-list-item-content>
        </v-layout>
        <v-list-item-action class="ml-auto">
          <v-btn icon @click.stop="drawer = !drawer" class="ml-auto"><v-icon class="white--text">mdi-chevron-left-box</v-icon></v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <div v-for="link in links" :key="link.text">
        <v-list-item v-if="link.public || status" router :to="link.route">
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
       <v-list-item v-if="status" @click="logout">
        <v-list-item-action>
          <v-icon class="white--text">mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="white--text">Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</nav>
</template>

<script>

import utility from '../utility.js'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Navbar',
  data: () => ({
    timer: {},
    notifMenu: 0,
    msgMenu: 0,
    notifNum: 0,
    newMsgNum: 0,
    drawer: false,
    links: [
      {
        icon: 'mdi-home-circle',
        text: 'Home',
        route: '/',
        public: true
      }, {
        icon: 'mdi-account-group',
        text: 'Discover',
        route: '/discover',
        public: false
      }, {
        icon: 'mdi-account-search',
        text: 'Search',
        route: '/search',
        public: false
      }, {
        icon: 'mdi-chat',
        text: 'Chat',
        route: '/chat',
        public: false
      }, {
        icon: 'mdi-bell',
        text: 'Notifications',
        route: '/notifications',
        public: false
      }, {
        icon: 'mdi-account-cog',
        text: 'Settings',
        route: '/settings',
        public: false
      }
    ]
  }),
  async created () {
    try {
      const token = localStorage.getItem('token')
      const url = `${process.env.URL}/api/auth/isloggedin`
      const headers = { 'x-auth-token': token }
      const res = await this.$http.get(url, { headers })
      if (!res.body.msg) {
        const user = res.body
        if (user.birthdate) {
          user.birthdate = new Date(user.birthdate).toISOString().substr(0, 10)
        }
        this.in(user)
      }
    } catch (err) {
      console.log('Got error here -->', err)
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'notif',
      'status',
      'convos',
      'typingSec',
      'profileImage'
    ]),
    typingConvos () {
      return this.typingSec.convos ? this.typingSec.convos.length : false
    },
    image () {
      return this.getFullPath(this.profileImage)
    },
    notifs () {
      return this.notif.filter(cur => cur.type !== 'chat').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7)
    },
    menuConvos () {
      return this.convos.slice(0, 7)
    }
  },
  watch: {
    notif: {
      immediate: true,
      handler () {
        this.newMsgNum = this.notif
          .filter(cur => cur.type === 'chat' && !cur.is_read).length
        this.notifNum = this.notif
          .filter(cur => cur.type !== 'chat' && !cur.is_read).length
      }
    },
    async notifMenu () {
      if (this.notifMenu) {
        const url = `${process.env.URL}/api/notif/update`
        const headers = { 'x-auth-token': this.user.token }
        // eslint-disable-next-line
        const res = await this.$http.post(url, {} ,{headers} )
        this.seenNotif()
      }
    },
    typingConvos () {
      if (this.typingSec.status) {
        const len = this.typingSec.convos.length
        const convId = this.typingSec.convos[len - 1].id_conversation
        if (this.timer[convId]) clearTimeout(this.timer[convId])
        this.timer[convId] = setTimeout(() => this.typingSecClr(convId), 1200)
      }
    }
  },
  methods: {
    ...utility,
    ...mapActions({
      in: 'login',
      out: 'logout',
      syncConvo: 'syncConvo',
      seenNotif: 'seenNotif',
      typingSecClr: 'typingSecClr'
    }),
    toUserProfile (id) {
      this.$router.push(`/user/${id}`)
    },
    toUserChat (convo) {
      this.syncConvo(convo)
      // eslint-disable-next-line
      this.$router.push('/chat').catch(err => {
      })
    },
    async logout () {
      try {
        const url = `${process.env.URL}/api/auth/logout`
        const headers = { 'x-auth-token': this.user.token }
        const res = await this.$http.get(url, { headers })
        if (res.body.ok) this.out(this.user.id)
        // eslint-disable-next-line
        this.$router.push('/').catch(err => {
        })
      } catch (err) {
        console.log('problem with -->', err)
      }
    },
    formatNotifDate (item) {
      return moment.utc(item.date ? item.date : item.last_update).fromNow()
    }
  }
}

</script>
