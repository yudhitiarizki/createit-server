const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

const router = require('./routes/index');

const PORT = process.env.PORT || 5000;
const public = __dirname + "/public/";

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/public/uploads', express.static(path.join(public, "uploads")));

app.use('/', router);

app.get('/', function(req, res) {
    res.sendFile(path.join(public + "index.html"));
});

app.get('/download/:fileName', (req, res) => {
    const { fileName } = req.params;
    const file = __dirname + `/public/uploads/files/${fileName}`;
    res.download(file); // Set disposition and send it.
})

server.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));

let users = [];

const addUser = (userId, socketId) => {
  !users.some(user=> user.userId === userId) && 
    users.push({userId, socketId});
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
}

const getUser = userId => {
  return users.find(user => user.userId === userId)
}

// Handle new connections
io.on('connection', socket => {
    //handle connect
    console.log('A user connected: '+`${socket.id}`);
    socket.on('addUser', userId => {
      addUser(userId, socket.id);
      io.emit('getUsers', users)
    })
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      removeUser(socket.id)
      io.emit('getUsers', users)
    });

    // Handle event from client
    socket.on('sendMessage', ({senderId, reseiverId, text, date}) => {
      const user = getUser(reseiverId);
      io.to(user.socketId).emit('getMessage', {
        senderId, text, date
      })
    });
  });

