import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store';
import axios from 'axios';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VAvatar,
  VDivider,
  VCard,
  VForm,
  VTextField,
  VAlert,
  VProgressCircular
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

import AlertCmp from './components/Shared/Alert.vue';
import ErrorFilter from './filters/error';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VAvatar,
    VDivider,
    VCard,
    VForm,
    VTextField,
    VAlert,
    VProgressCircular
  },
  theme: {
    primary: "#1565C0",
    secondary: "#5C6BC0",
    accent: "#E91E63",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50"
  }
})

// Filters
Vue.filter('error', ErrorFilter);
// Components
Vue.component('app-alert', AlertCmp);

Vue.config.productionTip = false

// axios.defaults.baseURL = "https://test-r-app.firebaseio.com";


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch("tryAutoLogin");
  }
})
