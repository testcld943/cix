const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Policy = require('../models/policy.model');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const request = require('request')

router.get('/', function(req, res) {
    Policy.find({},(err, policies)=> {
        res.send(policies);
    })
});


router.post('/', async (req, res) => {
    try{
      let data = req.body;
      data._id = new  mongoose.Types.ObjectId()
      let message = new Policy(data);
  
        let savedMessage = await message.save()
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