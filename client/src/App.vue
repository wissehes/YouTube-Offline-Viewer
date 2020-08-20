<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1>YouTube Downloader</h1>
      <v-spacer />
      <v-btn icon color="white" @click="toggleDarkMode">
        <v-icon>{{ $vuetify.theme.dark ? 'mdi-brightness-7' : 'mdi-brightness-5' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({}),
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark", this.$vuetify.theme.dark);
    }
  },
  mounted() {
    if (localStorage.getItem("dark") == null) {
      localStorage.setItem("dark", false);
    } else {
      this.$vuetify.theme.dark = localStorage.getItem("dark") == "true";
    }
  }
};
</script>
