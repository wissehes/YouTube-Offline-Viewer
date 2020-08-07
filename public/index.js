const VueApp = new Vue({
    el: "#app",
    data: () => ({
        videos: {},
        loading: true
    }),
    methods: {
        getAllVideos() {
            axios.get("/api/videos")
                .then(r => this.videos = r.data)
                .finally(_ => this.loading = false)
        }
    },
    created() {
        this.getAllVideos()
    }
})