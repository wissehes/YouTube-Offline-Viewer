<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1>YouTube Downloader</h1>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  })
};
</script>
