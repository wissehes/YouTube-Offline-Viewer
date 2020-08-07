const express = require('express')
const router = express.Router()
const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});

router.get("/", (req, res) => {
    res.render("home", {
        videos: store.data
    })
})

module.exports = {
    path: "/",
    router
}