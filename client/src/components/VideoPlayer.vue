<template>
  <div>
    <VuePlyr class="video" :options="options" ref="player">
      <video :src="videoURL" :poster="poster"></video>
    </VuePlyr>
  </div>
</template>

<script>
import VuePlyr from "vue-plyr";
import axios from "axios";

export default {
  props: {
    video: Object
  },
  data: () => ({
    options: {
      storage: { enabled: true, key: "plyr" }
    },
    timeUpdated: 0,
    maxTimeUpdates: 10
  }),
  components: {
    VuePlyr
  },
  mounted() {
    if (this.video.playing_progress) {
      this.player.once(
        "canplay",
        () => (this.player.currentTime = this.video.playing_progress)
      );
    }
    this.player.on("timeupdate", () => {
      if (this.timeUpdated == this.maxTimeUpdates) {
        this.timeUpdated = 0;
        if (this.player.currentTime > 10) {
          axios.get(
            `/api/progress/set/${this.video.id}/${this.player.currentTime}`
          );
        }
      } else {
        this.timeUpdated++;
      }
    });
  },
  computed: {
    videoURL() {
      return `/view/${this.video.id}`;
    },
    poster() {
      return this.video.thumbnails[this.video.thumbnails.length - 1].url;
    },
    player() {
      return this.$refs.player.player;
    }
  }
};
</script>

<style scoped>
.video {
  height: 100%;
}
</style>