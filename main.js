var logFile = require('./log.js');
var mongodb = require("./mongodb.js");
var express = require('express');
var bodyParser = require('body-parser');
const { insert } = require('./mongodb.js');
var app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 80;
const smsPort = 8080;
const passwd = "9879";

var data = [];

//Starts Http server in client folder
app.use(express.static('client'))
console.log("HTTP server for ./client is running on PORT:"+port);

//Socket IO server
io.on('connection', (socket) => {

  socket.on('dataReq', location => {
    mongodb.find(location, function(result){
      io.emit('dataTx', result);
      logFile("Data Requested",result);
    });
    
    
    
  });
  //io.emit('dataTx', data);
  logFile("User Connected to socket.io",{});
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


//Sms Receive
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function (req, response, next) {
    response.contentType('application/xml');
    next();
});
app.set('port', (smsPort));
app.all('/receive_sms/', function (request, response) {
    // Sender's phone number
    var from_number = request.body.From || request.query.From;
    // Receiver's phone number - Plivo number
    var to_number = request.body.To || request.query.To;
    // The text which was received
    var text = request.body.Text || request.query.Text;
    
    if(text.slice(0,passwd.length) == passwd){
        var TextObj = JSON.parse(text.slice(passwd.length,text.length));
        TextObj.number = from_number;
        TextObj.time = Date.now();
        //mongodb.create(obj.location);
        mongodb.insert(TextObj.location,TextObj);
    }

    logFile("Text Recived",{
      From:from_number,
      To:to_number,
      Reading:TextObj.reading,
      Location:TextObj.location
    });
});
app.listen(app.get('port'), function () {
    console.log('SMS is running on port', app.get('port') + " in DIR /receive_sms/");
});

