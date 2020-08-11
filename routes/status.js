const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.json({
        satus: "online",
        time: Date.now(),
        serverType: "YouTube Offline Downloader"
    })
})

module.exports = {
    path: "/api/status",
    router
}