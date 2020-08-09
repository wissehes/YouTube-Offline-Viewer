<template>
  <div>
    <v-container fluid>
      <div v-if="loading"></div>
      <div v-else>
        <v-container fluid>
          <v-form ref="form">
            <v-row align="center" justify="center">
              <v-col sm="8">
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
                <v-btn color="primary" @click="downloadVideo">Download</v-btn>
              </v-col>
              <v-col>
                <v-btn
                  :loading="loading"
                  color="blue-grey"
                  class="ma-2 white--text"
                  fab
                  @click="loadVideos"
                >
                  <v-icon dark>mdi-reload</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>

        <v-row>
          <v-card v-if="videos == []" class="mx-auto" max-width="400">
            <v-card-title>No videos yet!</v-card-title>
          </v-card>
          <v-card
            v-else
            v-for="video in videos"
            :key="video.id"
            class="mx-auto mb-6"
            max-width="400"
            :loading="!video.downloaded"
            :disabled="!video.downloaded"
          >
            <v-img
              class="white--text align-end"
              height="200px"
              :src="video.thumbnails[video.thumbnails.length - 1].url"
            >
              <v-card-title>{{video.title}}</v-card-title>
            </v-img>

            <!-- <v-card-subtitle class="pb-0">size</v-card-subtitle> -->

            <v-card-actions>
              <v-btn color="orange" @click="playVideo(video)" text>Play</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </div>
    </v-container>
    <v-dialog v-model="videoDialog" width="800px">
      <VideoPlayer v-if="showPlayer" :video="selectedVideo" height="100%" />
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarError ? 'red' : 'primary'" :timeout="5000">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";

export default {
  name: "Home",
  data: () => ({
    videos: [],
    selectedVideo: {},
    videoDialog: false,
    showPlayer: false,
    loading: true,
    youTubeURL: "",
    YTURLRules: [
      v => !!v || "YouTube video is required!",
      v =>
        /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g.test(
          v
        ) || "Must be a valid YouTube URL!"
    ],
    snackbar: false,
    snackbarMessage: "",
    snackbarError: false
  }),
  created() {
    this.loadVideos();
  },
  watch: {
    videoDialog(v) {
      if (v) {
        this.showPlayer = true;
      } else {
        setTimeout(() => {
          this.showPlayer = false;
        }, 500);
      }
    }
  },
  components: {
    VideoPlayer
  },
  methods: {
    loadVideos() {
      axios
        .get("/api/videos")
        .then(r => (this.videos = r.data.reverse()))
        .finally(() => (this.loading = false));
    },
    showSnackbar(message, error = false) {
      if (error) {
        this.snackbarError = true;
        this.snackbarMessage = message;
        this.snackbar = true;
      } else {
        this.snackbarError = false;
        this.snackbarMessage = message;
        this.snackbar = true;
      }
    },
    playVideo(v) {
      this.selectedVideo = v;
      this.videoDialog = true;
    },
    downloadVideo() {
      if (this.$refs.form.validate()) {
        if (this.youTubeURL.trim() !== "") {
          axios
            .post("/api/download", {
              video: this.youTubeURL
            })
            .then(() => {
              this.showSnackbar("Started downloading video!");
              this.youTubeURL = "";
              this.loadVideos();
            });
        }
      }
    }
  }
};
</script>