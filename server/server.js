const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const app = express()
const server = http.Server(app)
const io = socketIO(server)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log('Starting server on port', PORT)
})

io.on('connection', (socket) => {

})

setInterval(() => {
  io.sockets.emit('message', 'hi from server socket')
}, 1000)
