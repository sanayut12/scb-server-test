const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var port = process.env.PORT || 3000
app.use(express.json())

/////////////   api service     ////////////
app.get('/',(req,res)=>{
    res.send("<h1>scb recieve callback</h1>")
})

app.get('/:name', (req, res) => {
    // res.sendFile(__dirname + '/index.html');
    var {name}= req.params
    console.log(name)
    io.emit('test', name);
    res.send(name)
});

app.post('/',(req,res)=>{
    var {
        name
    } = req.body
    console.log(name)
    res.json({"name is" : name})
})

app.post('/recieve-endpoint',(req,res)=>{
    var data = req.body
    console.log(data)
    io.emit('scb-endpoint', JSON.stringify(data));
    res.json({})
})

app.post('/recieve-callback',(req,res)=>{
    var data = req.body
    console.log(data)
    io.emit('scb-callback', JSON.stringify(data));
    res.json({})
})

///////////     socket      /////////////////
io.on('connection', (socket) => {
    socket.on('scb-callback', msg => {
      console.log(msg)
      io.emit('scb-callback', msg);
    });

    socket.on('scb-endpoint', msg => {
        console.log(msg)
        io.emit('scb-endpoint', msg);
      });

    socket.on('test', msg => {
        console.log(msg)
        io.emit('test', msg);
      });
});

http.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})

