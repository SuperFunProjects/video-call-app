const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { v4: uuid } = require('uuid');
const allPeers = {};
const port = process.env.PORT || '3000';

// socket and peer servers
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

// ISSUE: CANNOT RUN independent peer server and socket on same port with express server (source: peerjs github issue)
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
//     port: 4000
// });
// app.use('/peerjs', peerServer);

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// if hitting home, redirect to unique roomId
app.get('/', (req, res) => {
    res.redirect(`/${uuid()}`);
});
app.get('/:room', (req, res) => {
    res.render('index', { roomId: req.params.room });
});

// listening for join-room-request made by client and emitting client peer id to room
io.on('connection', (socket) => {
    socket.on('join-room-request', (roomId, id) => {
        allPeers[socket.id] = {
            "peerid": "",
            "roomId": ""
        };
        allPeers[socket.id]["peerid"] = id;
        allPeers[socket.id]["roomId"] = roomId;
        socket.join(roomId);
        socket.to(roomId).emit('add-new-user-peer', id); // to all clients in room except sender
    });
    socket.on('disconnect', () => {
        try {
            io.to(allPeers[socket.id]["roomId"]).emit('user-disconnected', allPeers[socket.id]["peerid"]);
            delete allPeers[socket.id];
            console.log('user-disconnected');
        } catch (err) {
            console.log('protocol -> paper bag -> err = ' + err);
        };
    })

});

// server on port 3000
server.listen(port, () => {
    console.log('server listening on port 3000');
});