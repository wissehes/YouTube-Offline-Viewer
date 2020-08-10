const store = require("data-store")({
    name: "videos",
    path: "./.config/videos.json",
});
const fs = require("fs");
module.exports = (id) => {
    return new Promise((resolve, reject) => {
        store.load()
        if (store.has(id) && fs.existsSync(`./videos/video_${id}.mp4`)) {
            try {
                fs.unlinkSync(`./videos/video_${id}.mp4`)
                store.del(id)
                resolve()
            } catch (e) {
                console.error(e)
                resolve()
            }
        } else if (store.has(id) && !fs.existsSync(`./videos/video_${id}.mp4`)) {
            try {
                store.del(id)
                resolve()
            } catch (e) {
                console.log(e)
                resolve()
            }
        } else if (!store.has(id) && fs.existsSync(`./videos/video_${id}.mp4`)) {
            try {
                fs.unlinkSync(`./videos/video_${id}.mp4`)
                resolve()
            } catch (e) {
                console.log(e)
                resolve()
            }
        }
    })
}