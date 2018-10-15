const   app = require('./app'),
        http = require('http'),
        port = process.env.PORT || 4000;

app.set('port', port);

const server = http.createServer(app);
server.listen(port);

server.on('listening', () => {
    console.log(`Server is listening on port ${server.address().port}`);
    console.log(process.env.PORT);
});

function normalizePort(val) {
    const port = parseInt(val, 10);
    if(isNaN(port)) return val;
    if(port >= 0) return port;
    return false;
}
