const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const ytdl = require("ytdl-core")
const fs = require("fs");
const downloadImage = require("./DownloadImage")
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');

module.exports = (videoURL, options = { viaSocket: false, express: false, req: null, res: null, socket: null }) => {
    const {
        viaSocket,
        res,
        req,
        socket
    } = options
    if (/(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g.test(videoURL)) {
        if (ytdl.validateURL(videoURL)) {
            try {
                if (fs.existsSync(`./videos/${ytdl.getVideoID(videoURL)}.mp4`)) {
                    fs.unlinkSync(`./videos/${ytdl.getVideoID(videoURL)}.mp4`)
                }
                console.log("starting")
                const tracker = {
                    start: Date.now(),
                    audio: { downloaded: 0, total: Infinity },
                    video: { downloaded: 0, total: Infinity },
                    merged: { frame: 0, speed: '0x', fps: 0 },
                };
                // Get audio and video stream going
                const audio = ytdl(videoURL, { quality: 'highestaudio' })
                    .on('progress', (_, downloaded, total) => {
                        tracker.audio = { downloaded, total };
                    });
                const video = ytdl(videoURL, { filter: 'videoonly', quality: 'highestvideo' })
                    .on('progress', (_, downloaded, total) => {
                        tracker.video = { downloaded, total };
                    });

                // Start the ffmpeg child process
                const ffmpegProcess = cp.spawn(ffmpeg, [
                    // Remove ffmpeg's console spamming
                    '-loglevel', '0', '-hide_banner',
                    // Redirect/enable progress messages
                    '-progress', 'pipe:3',
                    '-i', 'pipe:4',
                    '-i', 'pipe:5',
                    // Choose some fancy codes
                    '-c:v', 'copy',
                    '-c:a', 'aac',
                    // overwrite output file it exists
                    '-y',
                    // Define output container
                    `./videos/video_${ytdl.getVideoID(videoURL)}.mp4`,
                ], {
                    windowsHide: true,
                    stdio: [
                        /* Standard: stdin, stdout, stderr */
                        'inherit', 'inherit', 'inherit',
                        /* Custom: pipe:3, pipe:4, pipe:5, pipe:6 */
                        'pipe', 'pipe', 'pipe', 'pipe',
                    ],
                });

                audio.pipe(ffmpegProcess.stdio[4]);
                video.pipe(ffmpegProcess.stdio[5]);

                video.on("info", async info => {
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

                    info.videoDetails.author.avatar = `/api/image/avatar/${info.videoDetails.author.id}`
                    store.set(id, {
                        type: `youtube`,
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
                    let downloadProgressPercent = 0;
                    ffmpegProcess.stdio[3].on('data', () => {
                        const audioDownloaded = (tracker.audio.downloaded / tracker.audio.total) * 100
                        const videoDownloaded = (tracker.video.downloaded / tracker.video.total) * 100
                        const total = Math.round((videoDownloaded / 2) + (audioDownloaded / 2))
                        if (downloadProgressPercent != total) {
                            downloadProgressPercent = total
                            console.log(`${(total).toFixed(2)}% downloaded of ${info.videoDetails.title}`);
                            store.load()
                            store.set(`${id}.download_progress`, total)
                            if (viaSocket) {
                                socket.emit("videos", Object.values(store.data))
                            }
                        }
                    });
                    ffmpegProcess.on("close", _ => {
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