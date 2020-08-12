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
            <template v-slot:progress>
              <v-progress-linear
                :value="video.download_progress"
                v-if="video.download_progress < 1"
              ></v-progress-linear>
              <v-progress-linear v-else />
            </template>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar>
                  <v-img :src="video.author.avatar"></v-img>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline">{{ video.title }}</v-list-item-title>
                <v-list-item-subtitle>{{video.author.name}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-img
              class="white--text align-end"
              height="200px"
              :src="video.thumbnails[video.thumbnails.length - 1].url"
            >
              <v-card-title></v-card-title>
            </v-img>

            <!-- <v-card-subtitle class="pb-0">size</v-card-subtitle> -->

            <v-card-actions>
              <v-btn color="orange" @click="playVideo(video)" text>Play</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mx-2" fab dark small color="error" @click="deleteVideo(video.id)">
                <v-icon dark>mdi-close</v-icon>
              </v-btn>
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
import VideoPlayer from "../components/VideoPlayer";
import io from "socket.io-client";

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
    snackbarError: false,
    io: {}
  }),
  mounted() {
    this.io = io();
    this.io.on("videos", data => {
      this.loading = false;
      this.videos = data.reverse();
    });
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
      this.io.emit("getVideos");
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
          this.io.emit("download", this.youTubeURL);
          this.showSnackbar("Started downloading video!");
          this.youTubeURL = "";
        }
      }
    },
    deleteVideo(id) {
      this.io.emit("delete", id);
    }
  }
};
</script>
