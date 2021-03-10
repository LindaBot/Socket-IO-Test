const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Start with an empty list of users
var connectedSockets = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});


io.on('connection', (socket) => {
    // Subscribe to nickname setting
    socket.on('nickname', (name) => {
        // Set the nickname for the socket/user
        socket.nickname = name;

        // Send a message to all subscribed users
        connectedSockets.push(socket);

        // Get a list of nicknames from all connected sockets
        var usernames = connectedSockets.map(user => user.nickname)

        io.emit("users", {"usernames":usernames})
    });

    // // A user is disconnected, loop through all current users and delete that user
    socket.on('disconnect', () => {
        console.log(socket.nickname + " disconnected");
        // Find the user and delete it
        for (var i = 0; i < connectedSockets.length; i++)
        {
            if (connectedSockets[i].nickname === socket.nickname)
            {
                // Remove that user
                connectedSockets.splice(i, 1);
            }
        }
        console.log('a user disconnected');
        console.log(connectedSockets);

        // Get a list of nicknames from all connected sockets
        var usernames = connectedSockets.map(user => user.nickname)

        // Broadcast the new users to all connected clients
        io.emit("users", {"usernames":usernames});
    });
});