const config = require("./.config/config");
const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const fs = require("fs");
const http = require("http");

const express = require("express");
const app = express();

const server = http.createServer(app)

const io = require('socket.io')(server);

const bodyParser = require('body-parser')

app.use(bodyParser.json({ extended: true }))

const deleteVideo = require("./functions/DeleteVideo")
const download = require("./functions/DownloadVideo")


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (!config.dev || process.argv[2] == "-prod") {
    config.dev = false
    if (fs.existsSync("./client/dist")) {
        process.env.NODE_ENV = "production"
        app.use(express.static('./client/dist'))
    } else {
        console.log("You must build the front-end first by doing the following:")
        console.log("cd client")
        console.log("yarn")
        console.log("yarn build")
        return;
    }
}

// Initialize by looking up all the routes and using them
fs.readdir("./routes/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let route = require(`./routes/${file}`);
        app.use(route.path, route.router)
    });
});

app.get("/view/:id", (req, res) => {
    const { id } = req.params;
    try {
        store.load()
        if (store.has(id) && fs.existsSync(`./videos/video_${id}.mp4`)) {
            //fs.createReadStream(`./videos/video_${id}.mp4`).pipe(res);
            const path = `./videos/video_${id}.mp4`
            const stat = fs.statSync(path)
            const fileSize = stat.size
            const range = req.headers.range
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize - 1
                const chunksize = (end - start) + 1
                const file = fs.createReadStream(path, { start, end })
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                }
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                }
                res.writeHead(200, head)
                fs.createReadStream(path).pipe(res)
            }
        } else {
            res.status(404).json({
                error: "Video not found."
            })
        }
    } catch (e) {
        res.status(500).json({
            error: "An error ocurred!"
        })
    }
})

app.get("/api/videos", (req, res) => {
    store.load()
    const baseURL = req.protocol + '://' + req.get('host')
    const videos = Object.values(store.data)
    res.json(videos.map(v => {
        if (v.thumbnail) {
            v.thumbnail = baseURL + v.thumbnail
            v.author.avatar = baseURL + v.author.avatar
            return v
        } else {
            return v
        }
    }))
})

io.on('connect', socket => {
    store.load()
    socket.emit("videos", Object.values(store.data))
    socket.on("getVideos", () => {
        store.load()
        socket.emit("videos", Object.values(store.data))
    })
    socket.on("download", video => {
        if (video) {
            //downloadViaSocket(video, io)
            download(video, {
                viaSocket: true,
                socket
            })
        }
    })
    socket.on("delete", async id => {
        await deleteVideo(id)
        store.load()
        socket.emit("videos", Object.values(store.data))
    })
})

server.listen(config.web.port, () => {
    console.log(`[WEB] App ready in ${config.dev ? 'developer' : 'production'} mode! Listening on port ${config.web.port}!`)
    if (!config.dev)
        require('open')(`http://localhost:${config.web.port}`)
});
