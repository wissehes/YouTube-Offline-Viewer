const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.json({
        status: "online",
        time: Date.now(),
        serverType: "YouTube Offline Downloader"
    })
})

module.exports = {
    path: "/api/status",
    router
}