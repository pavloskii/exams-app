<template>
  <v-app>

    <!-- Left navigation drawer -->
      <!-- settings for later -->
      <!-- :mini-variant="miniVariant"
      :clipped="clipped" -->
    <v-navigation-drawer
      persistent
      v-model="navDrawer"
      :mini-variant="miniVariant"
      enable-resize-watcher
      fixed
      app
      class="grey darken-3"
      dark
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="./assets/logo.png" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>SEDC Exams</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list>
        <v-list-tile @click.stop="miniVariant = !miniVariant">
          <v-list-tile-action>
            <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile
          v-for="(item, i) in navItems"
          :key="i"
          :to="item.link"
         
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>


    </v-navigation-drawer>

    <!-- ToolBar -->
      <!-- toolbar for clipped setting -->
      <!-- :clipped-left="clipped" -->
    <v-toolbar
      app
      dark
      class="primary"
    >

      <v-toolbar-side-icon 
        @click.stop="navDrawer = !navDrawer"
      >
      </v-toolbar-side-icon>
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
          <v-btn 
            flat 
            v-for="item in navItems" 
            :key="item.title"
            :to="item.link"
          >
            <v-icon left>{{ item.icon }}</v-icon>{{ item.title }} 
          </v-btn>
      </v-toolbar-items>  
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <!-- <v-footer :fixed="fixed" app> -->
    <v-footer app>
      <v-layout row wrap justify-center>
        <v-flex xs12 py-3 text-xs-center>
          &copy;2018 — <strong>Igor Pavloski</strong>
        </v-flex>
      </v-layout>
    </v-footer>

  </v-app>
</template>

<script>
export default {
  data() {
    return {
      navDrawer: false,
      miniVariant: true
      // clipped: true,
      // fixed: false,
    };
  },
  computed: {
    title() {
      return this.$store.getters.pageTitle;
    },
    navItems() {
      let navItems = [
        { icon: "face", title: "Sign up", link: "/signup" },
        { icon: "lock_open", title: "Sign in", link: "/signin" }
      ];

      if (this.userIsAuthenticated) {
        navItems = [
          {
            icon: "supervisor_account",
            title: "View Meetups",
            link: "/meetups"
          },
          { icon: "room", title: "Organize Meetup", link: "/meetups/new" },
          { icon: "person", title: "Profile", link: "/profile" }
        ];
      }

      return navItems;
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch("logout");
    },
    created() {
      this.$store.dispatch("tryAutoLogin");
    }
  }
};
</script>
