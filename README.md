# YouTube-Offline-Viewer

View YouTube videos offline!

## Setup

### Cloning

Clone the repository by using `git`:

```
$ git clone https://github.com/TheChicken14/YouTube-Offline-Viewer.git
```

Or by downloading the zip file:
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

## Usage

To start the server, run `yarn start`, or `npm run start`.
Now navigate to `localhost:8000` (or whatever port you set in the config) and you will be able to download videos!
