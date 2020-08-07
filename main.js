const config = require("./.config/config");
const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const ytdl = require("ytdl-core");
const fs = require("fs");

const hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        getThumbnail: function (video) { return video.thumbnails[video.thumbnails.length - 1].url }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('./public'))

// Initialize by looking up all the routes and using them
fs.readdir("./routes/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let route = require(`./routes/${file}`);
        app.use(route.path, route.router)
    });
});

// app.get("/download/:key", async (req, res) => {
//     const { key } = req.params;
//     try {
//         const dVideo = ytdl(key, { quality: "highestvideo", filter: format => format.container === 'mp4' })
//         dVideo.pipe(fs.createWriteStream(`./videos/video_${key}.mp4`));
//         dVideo.on("info", info => {
//             store.set(key, {
//                 id: key,
//                 title: info.videoDetails.title,
//                 author: info.videoDetails.author,
//                 thumbnails: info.videoDetails.thumbnail.thumbnails
//             })
//         })
//         dVideo.on("progress", (_, _1, _2) => {
//             console.log("chunk byte", _)
//             console.log("total bytes", _1)
//             console.log("total bytes", _2)
//         })
//         dVideo.on("end", _ => {
//             res.json({
//                 message: "Successfully downloaded video",
//                 success: true
//             })
//         })
//     } catch (e) {
//         console.log(e)
//         res.status(404).json({
//             error: "Video not found",
//         })
//     }
// });

app.get("/view/:id", (req, res) => {
    const { id } = req.params;
    try {
        if (store.has(id) && fs.existsSync(`./videos/video_${id}.mp4`)) {
            fs.createReadStream(`./videos/video_${id}.mp4`).pipe(res);
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
    res.json(store.data)
})

app.listen(config.web.port, () =>
    console.log(`[WEB] App ready! Listening on port ${config.web.port}!`)
);
