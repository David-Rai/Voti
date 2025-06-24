const express = require('express');
const app = express();
const PORT = process.env.PORT || 1111;
const cors = require("cors")
const http = require("http")
const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");
const { isKeyObject } = require('util/types');

//Middlewares
app.use(cors())
app.use(express.json())

//Socket connection established
const server = http.createServer(app)
const socket = new Server(server, {
    cors: {
        origin: "*"
    }
})

//******Socket handling*******
socket.on("connection", (client) => {
    console.log(`new connection ${client.id}`)

    //when user want to publish statement
    client.on("create", ({ title, options }) => {
        const uniqueId = uuidv4();
        client.join(uniqueId)//creating or joining the unique Room

    //Boardcasting the unique id
    socket.emit("roomId",uniqueId)

        console.log(uniqueId)
        console.log("Options", options)
    })

}
)

//***********Express Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});


server.listen(PORT, () => {
    console.log(`Server running on port PORT`);
});