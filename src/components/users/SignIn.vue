<template>
  <v-container>

    <v-layout justify-center>
      <v-flex xs12 sm8 md4>
        <img src="../../assets/sedc.jpg" style="width: 100%">
      </v-flex>
    </v-layout>

    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message | error"></app-alert>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>

              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      prepend-icon="email" 
                      name="email"
                      label="Mail"
                      id="email"
                      v-model="email"
                      type="email"
                      required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      prepend-icon="lock" 
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit" :disabled="loading" :loading="loading" class="primary">
                      Sign in
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>

            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    onSignin() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    }
  },
  created() {
    this.$store.dispatch("setPageTitle", "Sign in");
  }
};
</script>
