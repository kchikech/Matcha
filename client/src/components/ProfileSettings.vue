<template>
<v-container>
  <h1 class="heading display-2 font-weight-thin py-3 mb-4">Parameters</h1>
  <v-layout wrap justify-center align-start class="my-4">
    <v-flex xs12 sm6 class="px-3 my-3">
      <v-layout align-center class="px-3">
        <v-text-field disabled label="Email" color="primary" v-model="user.email"></v-text-field>
        <v-icon color="primary" class="ml-3" @click="emailDialog = true">edit</v-icon>
      </v-layout>
    </v-flex>
    <v-flex xs12 sm6 class="px-3 my-3">
      <v-layout align-center class="px-3">
        <v-text-field  disabled color="primary" value="**********" label="Password" type="password"></v-text-field>
        <v-icon color="primary" class="ml-3" @click="passDialog = true">edit</v-icon>
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-btn outlined block large color="primary" @click="openLoc">
        <span>Change location</span>
        <v-icon right>mdi-map-marker</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
  <v-expansion-panels >
  <v-expansion-panel v-model="blacklistPanel" :disabled="closePanel" class="blacklist">
      <v-expansion-panel-header>
        <div class="expansion_list">Blacklist</div>
      </v-expansion-panel-header>
    <v-expansion-panel-content  :ripple="{ class: 'primary--text' }" expand-icon="mdi-arrow-down">
      <v-list class="blacklist_list">
        <v-list-item v-for="banned in blacklist" :key="banned.id" class="blacklist_item mx-2">
          <v-list-item-content>
            <v-list-item-title>{{ banned.username }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon @click="unBlock(banned)">mdi-close</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
  </v-expansion-panels>
  <v-dialog v-model="emailDialog" max-width="500" persistent v-if="reRender">
    <v-card class="grey lighten-3">
      <v-container>
        <h5 class="display-1 display-2 text-xs-center text-md-left font-weight-thin pt-3 pb-3 mb-4 hidden-sm-and-down">Change email</h5>
        <v-form v-model="valid" class="my-4">
          <v-text-field  color="primary" v-model="password" validate-on-blur :rules="passRules" label="Current password" required :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" @click:append="showPass = !showPass"
          ></v-text-field>
          <v-text-field color="primary" class="my-3" validate-on-blur v-model="email" :rules="emailRules" label="Email" required></v-text-field>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="saveEmail" :disabled="!valid">Save</v-btn>
          <v-btn text color="primary" @click="closeEmail">Cancel</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
  <v-dialog v-model="passDialog" max-width="500" persistent v-if="reRender">
    <v-card class="grey lighten-3">
      <v-container>
        <h5 class="display-1 display-2 text-xs-center text-md-left font-weight-thin pt-3 pb-3 mb-4 hidden-sm-and-down">Change password</h5>
        <v-form v-model="valid" class="my-4">
          <v-text-field color="primary" class="mb-4" v-model="password" validate-on-blur :rules="passRules" label="Current password" autocomplete="off" required :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" @click:append="showPass = !showPass"
          ></v-text-field>
          <v-text-field color="primary" class="mb-4" v-model="newPassword" validate-on-blur :rules="passRules" label="New password" autocomplete="off" required :append-icon="showNewPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showNewPass ? 'text' : 'password'" @click:append="showNewPass = !showNewPass"></v-text-field>
          <v-text-field color="primary" class="mb-4" v-model="confNewPassword" validate-on-blur label="Confirm new password" autocomplete="off" required :append-icon="showConfNewPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showConfNewPass ? 'text' : 'password'" @click:append="showConfNewPass = !showConfNewPass" :error-messages="passwordMatch()"></v-text-field>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="savePass" :disabled="!valid">Save</v-btn>
          <v-btn text color="primary" @click="closePass">Cancel</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
  <v-dialog v-if="flag" v-model="locDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary" class="map_toolbar">
        <v-btn icon dark @click="locDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Location</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="changeLoc">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <map-location-selector :latitude="latitude" :longitude="longitude" @locationUpdated="locationUpdated"></map-location-selector>
    </v-card>
  </v-dialog>
  <alert :data="alert"></alert>
</v-container>
</template>

<script>
import Alert from './Alert'
import utility from '../utility.js'
import mapLocationSelector from 'vue-google-maps-location-selector/src/GoogleMapsLocationSelector'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProfileSettings',
  components: {
    Alert,
    mapLocationSelector
  },
  data: () => ({
    f: false,
    flag: false,
    valid: false,
    reRender: true,
    showPass: false,
    locDialog: false,
    passDialog: false,
    showNewPass: false,
    blacklistOn: false,
    emailDialog: false,
    blacklistPanel: true,
    showConfNewPass: false,
    password: '',
    newPassword: '',
    confNewPassword: '',
    email: '',
    loc: {
      lat: null,
      lng: null
    },
    alert: {
      state: false,
      color: '',
      text: ''
    },
    passRules: [
      v => !!v || 'This field is required',
      v => /^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z!@#$%]+$/.test(v) || 'Password must contain at least one letter, one number and one special char',
      v => v.length >= 8 || 'Password must be at least 8 characters long'
    ],
    emailRules: [
      v => !!v || 'This field is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    colors: [
      '#03A9F4',
      '#43A047',
      '#E64A19',
      '#D81B60',
      '#263238'
    ]
  }),
  computed: {
    ...mapGetters([
      'user',
      'blocked',
      'location',
      'blockedBy',
      'blacklist'
    ]),
    latitude () {
      return Number(this.location.lat)
    },
    longitude () {
      return Number(this.location.lng)
    },
    closePanel () {
      if (!this.blacklist.length) {
        // this.blacklistPanel = false
        return true
      }
      return false
    }
  },
  watch: {
    location: {
      immediate: true,
      handler () {
        this.loc.lat = Number(this.location.lat)
        this.loc.lng = Number(this.location.lng)
      }
    }
  },
  methods: {
    ...utility,
    ...mapActions([
      'syncBlacklist',
      'updateUserEmail'
    ]),
    googleLoaded () {
      return (typeof window.google === 'object' && typeof window.google.maps === 'object')
    },
    openLoc () {
      this.locDialog = true
      this.flag = this.googleLoaded()
    },
    async saveEmail () {
      try {
        const url = `${process.env.URL}/api/users/changeemail`
        const headers = { 'x-auth-token': this.user.token }
        const data = {
          email: this.email,
          password: this.password
        }
        const res = await this.$http.post(url, data, { headers })
        this.password = ''
        this.valid = false
        if (res.body.ok) {
          this.showAlert('green', 'Your email has been updated', this)
          this.emailDialog = false
          this.updateUserEmail(this.email)
          this.email = ''
          this.reRenderComp()
        } else {
          this.showAlert('red', res.body.msg, this)
        }
      } catch (err) {
        console.log('Got error with -> ', err)
      }
    },
    async savePass () {
      try {
        const url = `${process.env.URL}/api/users/changepassword`
        const headers = { 'x-auth-token': this.user.token }
        const data = {
          password: this.password,
          newPassword: this.newPassword,
          confNewPassword: this.confNewPassword
        }
        const res = await this.$http.post(url, data, { headers })
        this.password = ''
        this.newPassword = ''
        this.confNewPassword = ''
        this.valid = false
        this.reRenderComp()
        if (res.body.ok) {
          this.showAlert('green', 'Your password has been updated', this)
          this.passDialog = false
        } else {
          this.showAlert('red', res.body.msg, this)
        }
      } catch (err) {
        console.log('Got error with -> ', err)
      }
    },
    closeEmail () {
      this.emailDialog = false
      this.password = ''
      this.email = ''
      this.reRenderComp()
    },
    closePass () {
      this.passDialog = false
      this.password = ''
      this.newPassword = ''
      this.confNewPassword = ''
      this.reRenderComp()
    },
    reRenderComp () {
      this.reRender = false
      this.$nextTick(() => (this.reRender = true))
    },
    passwordMatch () {
      return this.passMatch(this.confNewPassword, this.newPassword)
    },
    locationUpdated (loc) {
      this.loc = loc
    },
    async changeLoc () {
      this.locDialog = false
      const url = `${process.env.URL}/api/users/location`
      const headers = { 'x-auth-token': this.user.token }
      const result = await this.$http.post(url, this.loc, { headers })
      if (result.body.ok) {
        this.$store.commit('locate', this.loc)
        this.showAlert('green', 'Your location has been updated', this)
      } else {
        this.showAlert('red', result.body.msg, this)
      }
    },
    async unBlock (banned) {
      const { id, username } = banned
      const url = `${process.env.URL}/api/users/unblock`
      const headers = { 'x-auth-token': this.user.token }
      const result = await this.$http.post(url, { id }, { headers })
      if (result.body.ok) {
        const blacklist = {
          blocked: this.blocked.filter(cur => cur !== id) || [],
          blockedBy: this.blockedBy
        }
        this.$store.commit('syncBlocked', blacklist)
        this.syncBlacklist(blacklist.blocked)
        this.showAlert('green', `${username} has been ublocked`, this)
      } else {
        this.showAlert('red', result.body.msg, this)
      }
    }
  }
}
</script>

<style>
.map_toolbar {
  z-index: 5;
}

.map-container {
  position: initial !important;
}

.blacklist {
  box-shadow: none;
  border: 1px solid var(--color-primary);
  border-radius: 3px;
}

.blacklist > li,
.blacklist_list,
.blacklist_item {
  background-color: #fafafa !important;
}

.expansion_list {
  color: #666;
}

.v-expansion-panel__header {
  padding: 8px 24px;
}

.color_picker {
  width: 4rem;
  height: 4rem;
  margin: 1vw 2vw;
  border-radius: 5px;
  cursor: pointer;
}
</style>
