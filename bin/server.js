const http = require('http');
const app = require('../app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

server.on('listening',()=>{
    console.log('El servidor escuchando en el puerto: ',port);
})