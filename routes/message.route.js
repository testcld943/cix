const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/message.model');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Complaint = require('../models/complaint.model');
const request = require('request')

router.get('/', function(req, res) {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
    let token = req.headers.authorization.substring(7, req.headers.authorization.length),
    decoded;
    try {
        decoded = jwt.decode(token);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    var userId = decoded._id;
    // Fetch the user by id 
    User.findOne({_id: userId}).then(function(user){
        // Do something with the user
        return res.status(200).send({
            user
         });
    });
} else {
    //Error
    return res.sendStatus(400);
}
  var decoded = jwt.verify(token, 'CIX Auth Secret');
  console.log(decoded)

    Message.find({},(err, messages)=> {
        res.send(messages);
    })
});


router.get('/user/:user', (req, res) => {
    let user = req.params.user
    Message.aggregate([
      { $match: {username:user }},
      {
        $group: {
        "_id": "$groupId",
        "criticalitySummary": {$max:"$criticality"},
        "title":{$first: "$message"},
        "user":{$first: "$username"}
        //messages: { $push : "$$ROOT" }
      }}
    ])
    .then((messages)=> {
      res.send(messages);
  })
  .catch((e) => {
    res.send(e);
  });
});

router.get('/user-group/:user/:group', (req, res) => {
  let user = req.params.user
  let group = req.params.group
  Message.find({username: user,groupId:group},(err, messages)=> {
      res.send(messages);
  })
})

router.get('/list', (req, res) => {
  Message.aggregate([
    {
      $group: {
      "_id": "$groupId",
      "criticalitySummary": {$max:"$criticality"},
      "title":{$first: "$message"},
      "user":{$first: "$username"}
      //messages: { $push : "$$ROOT" }
    }}
  ])
  .then((messages)=> {
    res.send(messages);
  })
  .catch((e) => {
    res.send(e);
  });
});


router.get('/group/:group', (req, res) => {
  let group = req.params.group
  Message.find({groupId:group},(err, messages)=> {
      res.send(messages);
  })
})

router.get('/getApiData', (req, res) => {
  request.post(
      'http://complianceapp.us-east-2.elasticbeanstalk.com/compliance/getSmartContracts',
      {},
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
              res.send(body)
          }
      }
  );
})

router.post('/', async (req, res) => {
    try{
      let data = req.body;
      data.username = data.user.username;
      let originalUsername = data.user.username;
      if(data.groupId == 0) {
        data.groupId = await Message.count('_id').exec()+1;
      }
      data._id = new  mongoose.Types.ObjectId()
      let message = new Message(data);
  
      let savedMessage = await message.save()
      //io.emit('message', req.body);
      //res.sendStatus(200);
      //if(data.auto_reply == true) {
        if(data.message.indexOf('last conversation about your interest')!= -1) {
          data._id = new  mongoose.Types.ObjectId()
          data.username = 'david';
          data.message = 'Thanks for reconnecting. I would line to make investment for capital presservation, what do you recommend?';
          let message2 = new Message(data);
      
          let savedMessage2 = await message2.save()
        }
        if(data.message.indexOf('LAS variable')!= -1) {
          data._id = new  mongoose.Types.ObjectId()
          data.username = 'cix';
          data.message = 'you have tried misselling an annuity product';
          let message2 = new Message(data);
      
          let savedMessage2 = await message2.save()

          let complaintPayload = {
            username: originalUsername,
            insurer: 'david',
            description: '',
            flagType: 'misselling',
            criticality: 1,
            createdAt:Date.now()
          };
          // complaintPayload._id = new  mongoose.Types.ObjectId()

          // let complaint = new Complaint(complaintPayload);

          // let savedComplaint = await complaint.save();

        }
        // last conversation about your interest
        // Thanks for reconnecting. I would line to make investment for capital presservation, what do you recommend?
        // LAS variable - check
        // you've tried misselling an annuity product
        
      //}
      res.status(200).send(message);
    }
    catch (error){
      res.sendStatus(500);
      console.log('error',error);
    }
    finally{
      console.log('Message Posted')
    }
  
  })

module.exports = router;