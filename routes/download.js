const express = require('express')
const router = express.Router()

const download = require("../functions/DownloadVideo")

router.post("/", (req, res) => {
    const { video } = req.body;
    download(video, {
        viaSocket: false,
        req,
        res,
    })
})

module.exports = {
    path: "/api/download",
    router
}