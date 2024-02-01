const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: ["https://localhost:3000", "https://127.0.0.1:3000", "https://192.168.1.3:3000"],
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

    // // Listener for "callEnded" event
    // socket.on("callEnded", () => {
    //     console.log("Call ended event received.");
    //     // Add any additional logic related to callEnded event if needed
    // });
});

server.listen(5000, () => console.log("Video Server is running at port 5000"));
