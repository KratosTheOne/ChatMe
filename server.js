var express = require("express")
var bodyParser = require('body-parser')
var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)
var mongoose = require("mongoose")
const { isBuffer } = require("util")
var port = process.env.PORT || 5000

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = 'mongodb+srv://admin:<password>@node.n1yfe.mongodb.net/<databaseName>?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name : String,
    message : String
})

app.get('/messages', (req, res)=>{
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res)=>{
    var message = new Message(req.body)
    message.save((err)=> {
        if(err)
            console.log(500)
        
            io.emit('message', req.body)
            res.sendStatus(200)
        
    })
})

io.on("connection", (socket) => {
    console.log('user connected')
})

mongoose.connect(dbUrl, (err)=> {
    console.log('mongodb connection successful')
})

var server = http.listen(port, () => {
    console.log("Server is listening on port %d", port)
})

