<template>
  <v-col>
    <v-card
      class="mx-auto mb-6"
      max-width="400"
      :loading="isVideoLoading"
      :disabled="isVideoLoading"
    >
      <template v-slot:progress>
        <v-progress-linear :value="video.download_progress" v-if="video.download_progress > 1"></v-progress-linear>
        <v-progress-linear v-else indeterminate />
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
        v-if="video.thumbnail"
        :src="video.thumbnail"
      ></v-img>
      <v-img
        class="white--text align-end"
        height="200px"
        v-else
        :src="video.thumbnails[video.thumbnails.length - 1].url"
      ></v-img>

      <!-- <v-card-subtitle class="pb-0">size</v-card-subtitle> -->

      <v-card-actions v-if="!preview">
        <v-btn color="orange" @click="playVideo(video)" text>Play</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="mx-2" fab dark small color="error" @click="deleteVideo(video.id)">
          <v-icon dark>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
export default {
  props: {
    video: Object,
    playVideo: Function,
    preview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isVideoLoading() {
      if (this.preview == true) {
        return false;
      } else return !this.video.downloaded;
    }
  }
};
</script>