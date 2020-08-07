const express = require('express')
const router = express.Router()
const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});

router.post("/", (req, res) => {
    const { video } = req.body;
    if (/(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g.test(video)) {
        try {
            const dVideo = ytdl(key, { quality: "highestvideo", filter: format => format.container === 'mp4' })
            dVideo.pipe(fs.createWriteStream(`./videos/video_${key}.mp4`));
            dVideo.on("info", info => {
                store.set(key, {
                    id: key,
                    downloaded: false,
                    title: info.videoDetails.title,
                    author: info.videoDetails.author,
                    thumbnails: info.videoDetails.thumbnail.thumbnails
                })
                res.json({
                    message: "Successfully started downloading video",
                    success: true
                })
            })
            // dVideo.on("progress", (_, _1, _2) => {
            //     console.log("chunk byte", _)
            //     console.log("total bytes", _1)
            //     console.log("total bytes", _2)
            // })
            dVideo.on("end", _ => {
                if (store.has(key)) {
                    const vid = store.get(key)
                    vid.downloaded = true
                    store.set(key, vid)
                }
            })
        } catch (e) {
            console.log(e)
            res.status(404).json({
                error: "Video not found",
            })
        }
    } else {
        res.status(400).json({
            error: "Invalid URL!"
        })
    }
})

module.exports = {
    path: "/api/download",
    router
}