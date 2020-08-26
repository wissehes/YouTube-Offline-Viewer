<template>
  <v-sheet>
    <v-card>
      <v-card-title>Download video</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col sm="10">
              <v-textarea
                prepend-icon="mdi-link"
                label="YouTube URL"
                auto-grow
                rows="1"
                row-height="10"
                v-model="youTubeURL"
                :rules="YTURLRules"
              ></v-textarea>
            </v-col>
            <v-col>
              <v-btn color="primary" fab @click="downloadVideo">
                <v-icon>mdi-cloud-download</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
<script>
export default {
  props: {
    downloadVideo: Function
  },
  data: () => ({
    youTubeURL: "",
    YTURLRules: [
      v => !!v || "YouTube video is required!",
      v =>
        /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g.test(
          v
        ) || "Must be a valid YouTube URL!"
    ]
  })
};
</script>