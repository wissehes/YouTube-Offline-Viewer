const config = require("./.config/config");
const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const fs = require("fs");

app.use(bodyParser.json({ extended: true }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (!config.dev) {
    if (fs.existsSync("./client/dist")) {
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
    store.load()
    res.json(Object.values(store.data))
})

app.listen(config.web.port, () =>
    console.log(`[WEB] App ready! Listening on port ${config.web.port}!`)
);
