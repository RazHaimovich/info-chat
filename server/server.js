const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIo = require("socket.io");
const usersManager = require('./usersManager');

require('dotenv').config();

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    usersManager(io);
    console.log('listening on *:' + PORT);
});
