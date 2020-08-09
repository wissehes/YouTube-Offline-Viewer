const express = require('express')
const router = express.Router()
const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const fs = require("fs");

router.get("/set/:id/:progress", (req, res) => {
    const { id, progress } = req.params
    try {
        store.load()
        if (store.has(id) && fs.existsSync(`./videos/video_${id}.mp4`)) {
            if (isNaN(progress)) {
                res.status(400).json({
                    message: "Progress should be a number."
                })
            } else {
                store.set(`${id}.playing_progress`, Number(progress))
                res.json({
                    message: 'Success!'
                })
            }
        } else {
            res.status(404).json({
                error: "Not found!"
            })
        }
    } catch (e) {
        res.status(500)
    }

})

module.exports = {
    path: "/api/progress",
    router
}