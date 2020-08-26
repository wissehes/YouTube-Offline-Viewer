const express = require('express')
const router = express.Router()
const ytdl = require("ytdl-core")
router.post("/", (req, res) => {
    const { video } = req.body;
    ytdl.getInfo(video)
        .then(v => {
            res.json({
                type: `youtube`,
                id: v.videoDetails.videoId,
                timestamp: new Date(),
                playing_progress: 0,
                downloaded: false,
                download_progress: 0,
                title: v.videoDetails.title,
                author: v.videoDetails.author,
                thumbnails: v.videoDetails.thumbnail.thumbnails,
                thumbnail: v.videoDetails.thumbnail.thumbnails[v.videoDetails.thumbnail.thumbnails.length - 1].url
            })
        })
        .catch(() => res.status(404).json({
            error: "Video not found."
        }))
})

module.exports = {
    path: "/api/validate/video",
    router
}