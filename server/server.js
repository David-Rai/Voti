const express = require('express');
const app = express();
const PORT = process.env.PORT || 1111;
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

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

//Socket handling
socket.on("connection", (client) => {
    console.log(`new connection ${client.id}`)
}
)

app.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(PORT, () => {
    console.log(`Server running on port PORT`);
});