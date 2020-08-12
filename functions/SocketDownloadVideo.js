const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const ytdl = require("ytdl-core")
const fs = require("fs");


module.exports = (video, socket) => {
    if (/(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g.test(video)) {
        try {
            const dVideo = ytdl(video, { quality: "highest", filter: format => format.container === 'mp4' })
            dVideo.on("info", info => {
                const id = info.videoDetails.videoId
                if (!fs.existsSync("./videos/")) {
                    fs.mkdirSync("./videos")
                }
                dVideo.pipe(fs.createWriteStream(`./videos/video_${id}.mp4`));
                store.set(id, {
                    id: id,
                    timestamp: new Date(),
                    playing_progress: 0,
                    downloaded: false,
                    download_progress: 0,
                    title: info.videoDetails.title,
                    author: info.videoDetails.author,
                    thumbnails: info.videoDetails.thumbnail.thumbnails
                })
                let progress = 0;
                dVideo.on('progress', (chunkLength, downloaded, total) => {
                    const percent = Math.round((downloaded / total) * 100)
                    if (progress != percent) {
                        progress = percent;
                        console.log(`${(percent).toFixed(2)}% downloaded of ${info.videoDetails.title}`);
                        store.load()
                        store.set(`${id}.download_progress`, percent)
                        socket.emit("videos", Object.values(store.data))
                    }
                    //console.log(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
                });
                dVideo.on("end", _ => {
                    store.load()
                    if (store.has(id)) {
                        const vid = store.get(id)
                        vid.downloaded = true
                        store.set(id, vid)
                        socket.emit("videos", Object.values(store.data))
                    }
                })
                console.log(`Downloading ${info.videoDetails.title}...`)
            })
        } catch (e) {
            console.log(e)
            socket.emit("error", {
                error: "Video not found",
            })
        }
    } else {
        socket.emit("error", {
            error: "Invalid URL!"
        })
    }
}