<template>
  <div>
    <div class="header">
      <div class="header_layout"></div>
      <v-layout justify-center align-center class="header_content">
        <div class="header_center">
          <h1 class="display-3 white--text hidden-xs-only text-xs-center font-weight-thin mb-5">Meet Someone worth meeting today</h1>
          <v-layout justify-center wrap>
            <v-flex xs10 sm8 md7>
              <v-layout column>
                <h4 class="title font-weight-thin white--text mb-4">Show me</h4>
                <v-btn-toggle toggle_exclusive  mandatory v-model="gender">
                  <v-btn class="home_toggle_btn" text outlined color="primary" value="male"><span class="px-1">Men</span></v-btn>
                  <v-btn class="home_toggle_btn" text outlined color="primary" value="female"><span class="px-1">Women</span></v-btn>
                </v-btn-toggle>
                <h4 class="title font-weight-thin white--text mb-4">Near</h4>
                <v-text-field class="home_loaction_input mb-4" color="primary" outlined solo text append-icon="mdi-map-marker" v-model="location"></v-text-field>
                <h4 class="title font-weight-thin white--text mb-3">Age</h4>
                <v-range-slider class="mx-3 mb-4 pt-3" v-model="age" max="75" min="18" thumb-label="always" thumb-size="40" ></v-range-slider>
                <v-layout align-center justify-center >
                  <v-btn outlined block large color="primary" class="home_clear_btn"  @click="mainSearch"><v-icon>mdi-heart</v-icon><span>let's go</span></v-btn>
                </v-layout>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
      </v-layout>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Users',
  data: () => ({
    gender: null,
    location: null,
    age: [18, 85]
  }),
  computed: mapGetters(['tags']),
  methods: {
    mainSearch () {
      this.$router.push(`/search?gender=${this.gender}&location=${this.location}&min=${this.age[0]}&max=${this.age[1]}`)
    }
  }
}
</script>

<style>
/* .header_layout,   */
.header_content {
  height: 100%;
  width: 100%;
}

.header_center {
  z-index: 3;
}

/* .header_layout {
  z-index: 0;
  position: absolute;
  background: rgba(0, 0, 0, .6);
} */

.header {
  height: calc(100vh - 64px);
  background-image: url(https://images.hdqwalls.com/download/sweet-moment-wa-1366x768.jpg);
  background-position: center;
  background-size: cover;
}

.header > h1 {
  font-size: 5em !important;
}

.home_toggle.theme--light.v-btn-toggle {
  /* background: transparent !important; */
  display: flex;
  justify-content: center;
}

.home_toggle_btn {
  flex: 1 1 50%;
}

.home_loaction_input > .v-input__control > .v-input__slot,
.home_tags_menu > .v-input__control > .v-input__slot {
  border: 2px solid var(--color-primary) !important;
}

.home_clear_btn {
  height: 56px;
}

.v-select-list.v-card.theme--light {
  background: transparent;
}

.v-select-list.v-card.theme--light > .v-list.theme--light {
  background: rgba(0, 0, 0, .4);
  color: #fff;
}

.complete::-webkit-scrollbar-track {
  box-shadow: none;
  background: rgba(0, 0, 0, .4);
}

.complete::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
  border-radius: 4px;
}

.complete::-webkit-scrollbar {
  width: .45em;
}
</style>
