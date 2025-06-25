const express = require('express');
const app = express();
const PORT = process.env.PORT || 1111;
const cors = require("cors")
const http = require("http")
const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");

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

let rooms = {}

//******Socket handling*******
socket.on("connection", (client) => {
    console.log(`new connection ${client.id}`)

    //********Getting the votes****** */
    client.on("v1", (roomId) => {
        //checking weather room exist or not
        console.log("voting from",roomId)

        if (rooms[roomId]) {
            rooms[roomId].votes.v1 = rooms[roomId].votes.v1 + 1
            socket.to(roomId).emit("vote",rooms[roomId])
        }

    })

    client.on("v2", (roomId) => {
        //checking weather room exist or not
        console.log("voting from",roomId)

        if (rooms[roomId]) {
            rooms[roomId].votes.v2 = rooms[roomId].votes.v2 + 1
            socket.to(roomId).emit("vote",rooms[roomId])
        }

    })

    //*************Joining the socket room for voting
    client.on("join-room", (roomId) => {

        //checking weather room exist or not
        if (rooms[roomId]) {
            rooms[roomId].count = rooms[roomId].count + 1
        }

        client.join(roomId)
        client.emit("join-message", rooms[roomId])
        console.log(`joining ${roomId}`)
    })

    //*************when user want to publish statement
    client.on("create", (data) => {

        const { title, duration, options } = data
        const uniqueId = uuidv4();

        //saving the rooms counts
        rooms[uniqueId] = {
            count: 0,
            data,
            votes: {
                v1: 0,
                v2: 0
            }
        }

        //creating or joining the unique Room
        client.join(uniqueId)
        console.log(`join or created room ${uniqueId}`)


        //Deleting the room
        setTimeout(() => {
            // socket.to(uniqueId).emit("timer-ended")
            //Deleting logic for socket room



        }, parseInt(duration) * 3000)

        //Boardcasting the unique id
        socket.emit("roomId", uniqueId)
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