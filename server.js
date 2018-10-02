const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path')
 
const app = express();
const http = require('http');//.Server(app);
const io = require('socket.io')(http);

const user = require('./routes/user.route');
const message = require('./routes/message.route');
const policy = require('./routes/policy.route');
const complaint = require('./routes/complaint.route');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;
const SOCKET_PORT = process.env.SOCKET_PORT || 4001;
const dbUrl = 'mongodb://cts:Kiran123@ds113443.mlab.com:13443/cix'

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.use('/user', user);
app.use('/policy', policy);
app.use('/message', message);
app.use('/complaint', complaint);

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'public', 'index.html'));
});


  io.on('connection', (client) => {
    client.on('subscribeToEmail', (email) => {
      console.log('client is subscribing to message', email);
      client.emit('checkEmail', (()=> {
        Math.floor((Math.random() * 99) + 1);
      }));
    });
  });
  
  mongoose.connect(dbUrl ,(err) => {
    console.log('mongodb connected',err);
  })
  
  var server = http.createServer(app).listen(PORT, () => {
    console.log('server is running on port', server.address().port);
  });

  io.listen(SOCKET_PORT);
  console.log('listening on port ', SOCKET_PORT);
