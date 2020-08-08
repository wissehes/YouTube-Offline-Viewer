<template>
  <div>
    <video :src="`/view/${video.id}`" class="video" controls></video>
  </div>
</template>

<script>
export default {
  props: {
    video: Object
  }
};
</script>

<style scoped>
.video {
  width: 100%;
  height: 100%;
}
</style>