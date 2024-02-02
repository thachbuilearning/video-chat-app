const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

// const io = require("socket.io")(server, {
//     cors: {
//         origin: ["https://localhost:3000", "https://127.0.0.1:3000", "https://192.168.1.3:3000"],
//         method: ["GET", "POST"]
//     }
// });
const io = require("socket.io")(server, {
    cors: {
        origin: ["https://simple-peer-video-chat-frontend.vercel.app"],
        method: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.emit('me', socket.id);

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
        console.log(`Call initiated from ${socket.id} to ${data.userToCall}`);
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });

    socket.on("answerCall", (data) => {
        console.log(`Call answered from ${socket.id} to ${data.to}`);
        io.to(data.to).emit("callAccepted", data.signal);
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Video Server is running at port ${PORT}`));

