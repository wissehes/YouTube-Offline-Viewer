const express = require('express')
const router = express.Router()
const fs = require("fs");

const validateVideo = require("../functions/validateVideo")

router.delete("/:id", validateVideo, (req, res) => {
    try {
        const { video, videos } = req
        fs.unlinkSync(`./videos/video_${video.id}.mp4`)
        videos.del(video.id)
        res.json({
            message: `Successfully deleted ${video.id}`,
            success: true
        })
    } catch (e) {
        res.status(500)
    }

})

module.exports = {
    path: "/api/delete",
    router
}