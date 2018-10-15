const   app = require('./app'),
        http = require('http'),
        port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);
console.log(port);
server.listen(port);

server.on('listening', () => {
    console.log(`Server is listening on port ${server.address().port}`);
});

function normalizePort(val) {
    const port = parseInt(val, 10);
    if(isNaN(port)) return val;
    if(port >= 0) return port;
    return false;
}
