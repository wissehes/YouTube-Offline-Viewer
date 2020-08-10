module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    host: "localhost",
    hot: true,
    port: 8080,
    proxy: {
      //https://cli.vuejs.org/guide/html-and-static-assets.html#disable-index-generation
      "/*": {
        //everything from root
        target: "http://localhost:8000",
        secure: false,
        ws: false
      },
      "/ws/": {
        //web sockets
        target: "http://localhost:8000",
        secure: false,
        ws: true
      },
      "/socket.io/": {
        //web sockets
        target: "http://localhost:8000/socket.io/",
        secure: false,
        ws: true
      },
      "!/": {
        //except root, which is served by webpack's devserver, to faciliate instant updates
        target: "http://localhost:8000/",
        secure: false,
        ws: false
      }
    }
  }
};
