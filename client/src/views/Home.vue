<template>
  <v-sheet>
    <v-container fluid>
      <div v-if="loading"></div>
      <div v-else>
        <v-container fluid>
          <v-row align="center" justify="center">
            <v-col>
              <v-btn color="primary" @click="downloadDialog = true">Download</v-btn>
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
        </v-container>

        <v-row>
          <v-card v-if="!videos[0]" class="mx-auto" max-width="400">
            <v-card-title>No videos yet!</v-card-title>
          </v-card>
          <VideoCard
            v-else
            v-for="video in videos"
            :key="video.id"
            :video="video"
            :playVideo="playVideo"
          />
        </v-row>
      </div>
    </v-container>
    <v-dialog v-model="videoDialog" width="800px">
      <VideoPlayer
        v-if="showPlayer"
        :video="selectedVideo"
        height="100%"
        :close="closeVideoDialog"
      />
    </v-dialog>
    <v-dialog v-model="downloadDialog" width="600px">
      <DownloadVideo :downloadVideo="downloadVideo" />
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarError ? 'red' : 'primary'" :timeout="5000">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-sheet>
</template>

<script>
import VideoPlayer from "../components/VideoPlayer";
import VideoCard from "../components/VideoCard";
import DownloadVideo from "../components/DownloadVideo";
import io from "socket.io-client";

export default {
  name: "Home",
  data: () => ({
    videos: [],
    selectedVideo: {},
    videoDialog: false,
    downloadDialog: false,
    showPlayer: false,
    loading: true,
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
    this.io.on("error", () => this.showSnackbar("An error occured!", true));
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
    },
    youTubeURL(v) {
      if (v.trim() == "") {
        this.$refs.form.resetValidation();
      }
    }
  },
  components: {
    VideoPlayer,
    VideoCard,
    DownloadVideo
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
    downloadVideo(video) {
      if (video.trim() !== "") {
        this.io.emit("download", video);
        this.showSnackbar("Started downloading video!");
        return true;
      }
    },
    deleteVideo(id) {
      this.io.emit("delete", id);
    },
    closeVideoDialog() {
      this.videoDialog = false;
    }
  }
};
</script>
