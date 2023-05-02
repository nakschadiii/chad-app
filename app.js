const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');
const path = require('path');

const { spawn } = require('child_process');

app.get('*', (req, res) => {
    const clientHostname = req.headers.host;
    res.send(`Vous avez joint le site à partir de : ${clientHostname}`);
});

app.use(cors());
app.use(express.static(path.resolve(__dirname, 'client/build')));

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://85.90.245.34:3000"
    }
});

let users = [];

socketIO.on('connection', (socket) => {
    socket.removeAllListeners(); console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('message', (data) => { socketIO.emit('messageResponse', data); });
    socket.on('login', (data) => {  console.log(data); spawn('php', ['app.php', 'login', JSON.stringify(data)]).stdout.on('data', (data) => { if (data.toString() != null) { socket.emit('loginVerified', data.toString()); } }); });
    socket.on('register', (data) => { spawn('php', ['app.php', 'register', JSON.stringify(data)]).stdout.on('data', (data) => { if (data.toString() != null) { socket.emit('registerVerified', data.toString()); } }); });
    socket.on('disconnect', () => { console.log('🔥: A user disconnected'); users = users.filter((user) => user.socketID !== socket.id); socketIO.emit('newUserResponse', users); socket.disconnect(); });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});

app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});