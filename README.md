# YouTube-Offline-Viewer

View YouTube videos offline!

## Features
* Simple web UI
* Saves playback progress
* Fully working when offline, video thumbnails and profile avatars are all downloaded.
* Simple rest API

## To-do:
* [ ] Add info dialog
* [ ] Add confirm dialog when clicking delete button

## Setup

### Requirements

* Node JS version 12, you can download it at the [Node JS website](https://nodejs.org) or using [nvm](https://github.com/nvm-sh/nvm)
* Yarn or NPM
* Filesystem access, this app downloads the videos to the `videos` folder.

### Downloading

Clone the repository by using `git`:

```
$ git clone https://github.com/TheChicken14/YouTube-Offline-Viewer.git
```

Or by downloading the zip file: <br>
![download image with zip file option](https://i.imgur.com/nEUzFJ4.png)

### Installing dependencies
Using `npm`:
```
npm i
```
Using `Yarn`:
```
yarn
```

### Building Frontend
You need to build the frontend first if you want to use the web interface.
Build it like so:
```
cd client # go to the client directory
yarn # or 'npm i' when using npm
yarn build # or `npm run build` when using npm
```

### Configuration
First, rename `config.example.js` to `config.js` and change the port if you like.
Then, in the root of the project, create a folder called `.config` and move the `config.js` file in it.
Thats all!
Create a folder called `.config` and create a file called `config.js` in that folder. After that, paste this in that file:
```js
module.exports = {
    web: {
        port: 8000 // Change this to your desired port
    },
    dev: false // Set to true if developing
}
```

## Usage

To start the server, run `yarn start`, or `npm run start`.
Your browser should now automatically open the web interface.
If it doesn't, navigate to `localhost:8000` (or whatever port you set in the config) and you will be able to download videos!
