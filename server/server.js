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

const roomTimers = {};

//******Socket handling*******
socket.on("connection", (client) => {
    console.log(`new connection ${client.id}`)

    //when user want to publish statement
    client.on("create", ({ title, options, duration }) => {
        const uniqueId = uuidv4();

        //creating or joining the unique Room
        client.join(uniqueId)
        console.log(`join or created room ${uniqueId}`)


        //Deleting the room
        setTimeout(()=>{
         socket.to(uniqueId).emit("timer-ended")
        },parseInt(duration) * 2000 )

        //Boardcasting the unique id
        socket.emit("roomId", uniqueId)

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