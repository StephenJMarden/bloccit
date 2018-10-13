const   app = require('./app'),
        http = require('http'),
        server = http.createServer(app);

server.listen(3000);

server.on('listening', () => {
    console.log("Server is listening on port 3000");
});
