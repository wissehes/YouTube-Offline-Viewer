<template>
  <div>
    <VuePlyr class="video">
      <video :src="videoURL" :poster="poster"></video>
    </VuePlyr>
  </div>
</template>

<script>
import VuePlyr from "vue-plyr";

export default {
  props: {
    video: Object
  },
  components: {
    VuePlyr
  },
  computed: {
    videoURL() {
      return `/view/${this.video.id}`;
    },
    poster() {
      return this.video.thumbnails[this.video.thumbnails.length - 1].url;
    }
  }
};
</script>

<style scoped>
.video {
  height: 100%;
}
</style>