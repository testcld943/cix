const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Complaint = require('../models/complaint.model');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const request = require('request')

router.get('/', (req, res) => {
    Complaint.find({},(err, complaints)=> {
        res.send(complaints);
    })
});


router.post('/', async (req, res) => {
    try{
      let data = req.body;
      
      data._id = new  mongoose.Types.ObjectId()
      let complaint = new complaint(data);
  
      let savedcomplaint = await complaint.save()
      
      res.status(200).send(complaint);
    }
    catch (error){
      res.sendStatus(500);
      console.log('error',error);
    }
    finally{
      console.log('complaint Posted')
    }
  
  })

module.exports = router;