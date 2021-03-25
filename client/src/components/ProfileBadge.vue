<template>
<v-layout justify-center py-0>
  <v-flex xs12 sm11 md9 offset-lg3 offset-xl4 offset-md2 offset-sm1 class="badge text-capitalize">
    <h2 class="font-weight-thin mb-2">
      <div class="text-truncate full_name pr-3 d-inline">{{ `${user.first_name} ${user.last_name}` }}</div>
      <v-tooltip bottom v-if="!settings && like">
        <template v-slot:activator="{ on }">
          <span x="0px" y="0px" viewBox="0 0 407.585 407.585"  v-on="on" class="match_icon">
            <v-icon color="red" v-if="!match">mdi-heart-multiple-outline</v-icon>
            <v-icon color="red"  v-else>mdi-heart-multiple</v-icon>
          </span>
        </template>
        <span>{{ match ? 'You have a match' : 'This user likes you' }}</span>
      </v-tooltip>
    </h2>
    <h4 class="font-weight-thin mb-3">{{ `@${user.username}` }}</h4>
    <div class="font-weight-light text-truncate" v-for="field in fields" :key="field.icon">
      <p class="my-2" v-if="field.exist">
        <v-icon small>{{ field.icon }}</v-icon>
        <span class="ml-2">{{ field.text }}</span>
      </p>
    </div>
    <!-- <v-rating readonly dense :value="user.rating" half-increments class="rating mt-1"></v-rating> -->
  </v-flex>
</v-layout>
</template>

<script>
import moment from 'moment'
import utility from '../utility.js'

export default {
  name: 'ProfileBadge',
  props: {
    match: { type: Boolean, default: false },
    like: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },
    user: { type: Object, default: () => ({ }) }
  },
  computed: {
    fields () {
      return [
        {
          exist: true,
          icon: 'mdi-calendar',
          text: `Joined ${moment(this.user.created_at).format('MMMM YYYY')}`
        }, {
          exist: !!this.user.birthdate,
          icon: 'mdi-cake-variant',
          text: `Born ${moment(this.user.birthdate).format('MMMM D, YYYY')}`
        }, {
          exist: !!this.user.city && !!this.user.country,
          icon: 'mdi-map-marker',
          text: `${this.user.city}, ${this.user.country}`
        }
      ]
    }
  },
  methods: utility
}
</script>

<style>

.full_name {
  max-width: 80%;
}

.match_icon {
  width: 2rem;
  height: 2rem;
  margin-bottom: -.5rem !important;
  margin-left: -1rem !important;
}
</style>
