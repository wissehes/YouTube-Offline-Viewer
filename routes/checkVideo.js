const express = require('express')
const router = express.Router()
const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const fs = require("fs");

router.get("/:id", (req, res) => {
    const { id } = req.params
    try {
        store.load()
        if (store.has(id) && fs.existsSync(`./videos/video_${id}.mp4`)) {
            res.json({
                message: `Video ${id} exists!`
            })
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
    path: "/api/check",
    router
}