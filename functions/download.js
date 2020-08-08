module.exports = (video, socket) => {
    const dVideo = ytdl(video, { quality: "highest", filter: format => format.container === 'mp4' })
    dVideo.on("info", info => {
        const id = info.videoDetails.videoId
        dVideo.pipe(fs.createWriteStream(`../videos/video_${id}.mp4`));
        store.set(id, {
            id: id,
            downloaded: false,
            download_progress: 0,
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
        dVideo.on("progress", (_, _1, _2) => {
            console.log("chunk byte", _)
            console.log("total bytes", _1)
            console.log("total bytes", _2)
            const percentage = Math.round((_1 / _2) * 100)
            store.load()
            store.set(`${id}.download_progress`, percentage)
        })
    })
}