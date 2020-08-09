const express = require('express')
const router = express.Router()
const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const ytdl = require("ytdl-core")
const fs = require("fs");


router.post("/", (req, res) => {
    console.log(req.body)
    const { video } = req.body;
    if (/(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g.test(video)) {
        try {
            const dVideo = ytdl(video, { quality: "highest", filter: format => format.container === 'mp4' })
            dVideo.on("info", info => {
                const id = info.videoDetails.videoId
                dVideo.pipe(fs.createWriteStream(`./videos/video_${id}.mp4`));
                store.set(id, {
                    id: id,
                    timestamp: new Date(),
                    playing_progress: 0,
                    downloaded: false,
                    title: info.videoDetails.title,
                    author: info.videoDetails.author,
                    thumbnails: info.videoDetails.thumbnail.thumbnails
                })
                dVideo.on("end", _ => {
                    if (store.has(id)) {
                        const vid = store.get(id)
                        vid.downloaded = true
                        store.set(id, vid)
                    }
                })
                res.json({
                    message: "Successfully started downloading video",
                    success: true
                })
                console.log(`Downloading ${info.videoDetails.title}...`)
            })
            // dVideo.on("progress", (_, _1, _2) => {
            //     console.log("chunk byte", _)
            //     console.log("total bytes", _1)
            //     console.log("total bytes", _2)
            // })
            let starttime = Date.now()
            dVideo.on('progress', (chunkLength, downloaded, total) => {
                const percent = downloaded / total;
                console.log(`${(percent * 100).toFixed(2)}% downloaded `);
                console.log(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
            });
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