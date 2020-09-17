const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
//const hostname = '0.0.0.0';

const server = http.createServer(app);
//server.listen(port, hostname);
server.listen(port);

console.log("Server started on port "+port);

