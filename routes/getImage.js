const express = require('express')
const router = express.Router()

const fs = require("fs")

router.get("/:type/:id", (req, res) => {
    const {
        id,
        type
    } = req.params
    switch (type) {
        case "thumbnail":
            if (fs.existsSync(`./images/thumbnails/${id}.jpg`)) {
                const file = fs.createReadStream(`./images/thumbnails/${id}.jpg`)
                file.pipe(res)
            } else {
                res.status(404).json({
                    error: "Image not found."
                })
            }
            break;
        case "avatar":
            if (fs.existsSync(`./images/avatars/${id}.jpg`)) {
                const file = fs.createReadStream(`./images/avatars/${id}.jpg`)
                file.pipe(res)
            } else {
                res.status(404).json({
                    error: "Image not found."
                })
            }
            break;
        default:
            res.status(400).json({
                error: "You must provide a type and an id."
            })
    }
})

module.exports = {
    path: "/api/image",
    router
}