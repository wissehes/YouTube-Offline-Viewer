const axios = require("axios");
const fs = require("fs");

module.exports = async (url, id, type) => {
    return new Promise(async (resolve, reject) => {

        //const url = 'https://unsplash.com/photos/AaEQmoufHLk/download?force=true'
        let path;
        if (type == "avatar") {
            if (!fs.existsSync("./images/avatars/"))
                fs.mkdirSync("./images/avatars")
            path = `./images/avatars/${id}.jpg`
        }
        else {
            if (!fs.existsSync("./images/thumbnails/"))
                fs.mkdirSync("./images/thumbnails")
            path = `./images/thumbnails/${id}.jpg`
        }

        if (fs.existsSync(path)) {
            resolve()
        }

        const writer = fs.createWriteStream(path)

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })

        response.data.pipe(writer)

        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}