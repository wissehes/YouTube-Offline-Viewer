<template>
  <v-sheet>
    <v-card>
      <v-card-title>Download video</v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form">
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
                  v-debounce:300="getYoutubeData"
                ></v-textarea>
              </v-col>
              <v-col>
                <v-btn color="primary" fab @click="download">
                  <v-icon>mdi-cloud-download</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <VideoCard v-if="gotVideoData" :preview="true" :video="videoData" />
        </v-container>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
<script>
import { post } from "axios";
import VideoCard from "./VideoCard";

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
    ],
    gotVideoData: false,
    videoData: {}
  }),
  methods: {
    getYoutubeData() {
      post("/api/validate/video", {
        video: this.youTubeURL
      })
        .then(a => (this.videoData = a.data))
        .finally(() => (this.gotVideoData = true));
    },
    download() {
      if (this.$refs.form.validate()) this.downloadVideo(this.youTubeURL);
    }
  },
  components: {
    VideoCard
  }
};
</script>