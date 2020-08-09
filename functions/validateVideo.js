const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const fs = require("fs");

module.exports = (req, res, next) => {
    const { id } = req.params
    try {
        store.load()
        if (store.has(id) && fs.existsSync(`./videos/video_${id}.mp4`)) {
            req.video = store.get(id)
            req.videos = store
            next()
        } else {
            res.status(404).json({
                error: "Not found!"
            })
        }
    } catch (e) {
        res.status(500)
    }
}