const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const ytdl = require("ytdl-core")
const fs = require("fs");
const downloadImage = require("./DownloadImage")

module.exports = (video, options = { viaSocket: false, express: false, req: null, res: null, socket: null }) => {
    const {
        viaSocket,
        res,
        req,
        socket
    } = options
    if (/(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g.test(video)) {
        if (ytdl.validateURL(video)) {
            try {
                const dVideo = ytdl(video, { quality: "highest", filter: format => format.container === 'mp4' })
                dVideo.on("info", async info => {
                    const id = info.videoDetails.videoId
                    if (!fs.existsSync("./videos/")) {
                        fs.mkdirSync("./videos")
                    }
                    if (!fs.existsSync("./images/")) {
                        fs.mkdirSync("./images")
                    }
                    await downloadImage(
                        info.videoDetails.thumbnail.thumbnails[info.videoDetails.thumbnail.thumbnails.length - 1].url,
                        id,
                        'thumbnail'
                    )
                    await downloadImage(
                        info.videoDetails.author.avatar,
                        info.videoDetails.author.id,
                        'avatar'
                    )
                    dVideo.pipe(fs.createWriteStream(`./videos/video_${id}.mp4`));
                    info.videoDetails.author.avatar = `/api/image/avatar/${info.videoDetails.author.id}`
                    store.set(id, {
                        id: id,
                        timestamp: new Date(),
                        playing_progress: 0,
                        downloaded: false,
                        download_progress: 0,
                        title: info.videoDetails.title,
                        author: info.videoDetails.author,
                        thumbnails: info.videoDetails.thumbnail.thumbnails,
                        thumbnail: `/api/image/thumbnail/${id}`
                    })
                    if (!viaSocket) {
                        res.json({
                            message: "Successfully started downloading video",
                            success: true
                        })
                    }
                    let progress = 0;
                    dVideo.on('progress', (chunkLength, downloaded, total) => {
                        const percent = Math.round((downloaded / total) * 100)
                        if (progress != percent) {
                            progress = percent;
                            console.log(`${(percent).toFixed(2)}% downloaded of ${info.videoDetails.title}`);
                            store.load()
                            store.set(`${id}.download_progress`, percent)
                            if (viaSocket) {
                                socket.emit("videos", Object.values(store.data))
                            }
                        }
                    });
                    dVideo.on("end", _ => {
                        store.load()
                        if (store.has(id)) {
                            const vid = store.get(id)
                            vid.downloaded = true
                            store.set(id, vid)
                            if (viaSocket) {
                                socket.emit("videos", Object.values(store.data))
                            }
                        }
                    })
                    console.log(`Downloading ${info.videoDetails.title}...`)
                })
            } catch (e) {
                console.log(e)
                if (viaSocket) {
                    socket.emit("error", {
                        error: "Video not found",
                    })
                } else {
                    res.status(404).json({
                        error: "Video not found",
                    })
                }
            }
        } else {
            if (viaSocket) {
                socket.emit("error", {
                    error: "Video not found",
                })
            } else {
                res.status(404).json({
                    error: "Video not found",
                })
            }
        }
    } else {
        if (viaSocket) {
            socket.emit("error", {
                error: "Invalid URL!"
            })
        } else {
            res.status(400).json({
                error: "Invalid URL!"
            })
        }
    }
}