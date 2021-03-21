import Vue from 'vue'
// import moment from 'moment'

const isExternal = url => url && (url.indexOf(':') > -1 || url.indexOf('//') > -1 || url.indexOf('www.') > -1)
const isBlocked = (state, id) => state.blocked.includes(id) || state.blockedBy.includes(id)

const getId = tab => {
  switch (tab) {
    case 'notif':
      return 'id_from'
    case 'convos':
      return 'user_id'
    default:
      return 'id'
  }
}

export default {
  isBlocked,
  // eslint-disable-next-line
  getFullPath: (file) => isExternal(file) ? file : `${process.env.URL}/uploads/${ file ? file : 'default.png' }`,
  sync: async type => {
    try {
      const token = localStorage.getItem('token')
      const url = `${process.env.URL}/api/users/${type}`
      const headers = { 'x-auth-token': token }
      return await Vue.http.get(url, { headers })
    } catch (err) {
      console.log('error here -->', err)
    }
  },

  filterBlocked (state, type) {
    return state[type].filter(cur => !isBlocked(state, cur[getId(type)]))
  },
  showAlert (color, text, comp) {
    comp.alert = {
      state: true,
      color,
      text
    }
  },
  passMatch: (p1, p2) => {
    return !p1.length || p2 === p1 ? '' : 'Passwords must match'
  }
}
