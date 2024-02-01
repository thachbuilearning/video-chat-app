const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

// const https = require('https');
// const fs = require('fs');
// const app = express();

// const options = {
//     key: fs.readFileSync('./private-key.pem', 'utf8'),
//     cert: fs.readFileSync('./certificate.pem', 'utf8'),
// };

// const server = https.createServer(options, app);


const io = require("socket.io")(server, {
    cors: {
        origin: ["https://localhost:3000", "https://127.0.0.1:3000"],
        method: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.emit('me', socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
});

server.listen(5000, () => console.log("Video Server is running at port 5000"));
