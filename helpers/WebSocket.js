// const Chat = require('../models/chat');
const formidable = require('formidable');
const socketIo = require('socket.io');

class WebSockets {
    
    constructor(server) {
        this.users = []
        this.io = socketIo(server);
        this.io.on('connection', socket => {
            this.connection(socket)
      });
    }
    getApiAndEmit(socket) {
        const response = new Date();
        // Emitting a new message. Will be consumed by the client
        socket.emit("FromAPI", response);
    };

    //handle new connection
    connection(client) { 
        //event to handle new message
        //console.log('new client ', client.handshake);
        client.emit('connectFirst', { 'connect': true })
        // this.getApiAndEmit(client)
        client.on('connect', socket => {
            console.log('new client ')
        })
        client.on('disconnect', () => {

        });
    }

    emiter(event, body) {
        if(body)
          this.io.emit(event, body);
      }
    broadcaster(event, body) {
        if(body) 
          this.io.emit(event, body);
      }

}
module.exports = WebSockets;