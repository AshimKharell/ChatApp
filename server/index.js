const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const messageRoute = require('./routes/messageRoutes')
const socket = require("socket.io");

const app = express();
require("dotenv").config();


app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoute)


mongoose.connect(process.env.MONGO_URL)
.then(()=> {
    console.log("DB Connection Sucessfuly");
}).catch((err) => {
    console.log(err.message);
})

const server = app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`Server running on port ${server.address().port}`);
});


const io = socket(server, {
    cors:{
        origin: ["http://localhost:3000", "http://192.168.1.61:3000"],
        credentials: true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket)=> {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", {
                from: data.from,      // Include the sender's ID
                message: data.message // Include the message content
            });
        }
    })
})

