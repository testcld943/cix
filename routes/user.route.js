const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Policy = require('../models/policy.model');

router.post('/signup', function(req, res) {
   bcrypt.hash(req.body.password, 10, function(err, hash){
      if(err) {
         return res.status(500).json({
            error: err
         });
      }
      else {
         const user = new User({
            _id: new  mongoose.Types.ObjectId(),
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            licensedState: req.body.state,
            policies: [],
            age: req.body.age,
            createdAt: Date.now(),
            role: 'user'
         });
         user.save().then(function(result) {
            console.log(result);
            res.status(200).json({
               success: 'New user has been created'
            });
         }).catch(error => {
            res.status(500).json({
               error: err
            });
         });
      }
   });
});

router.post('/signin', function(req, res){
   User.findOne({username: req.body.username})
   .exec()
   .then(function(user) {
      bcrypt.compare(req.body.password, user.password, function(err, result){
         if(err) {
            return res.status(401).json({
               failed: 'Unauthorized Access'
            });
         }
         if(result) {
            const JWTToken = jwt.sign({
               username: user.username,
               _id: user._id
            },
            'CIX Auth Secret',
               {
                  expiresIn: '2h'
               });
            return res.status(200).json({
                role:user.role,
                token: JWTToken
            });
         }
         return res.status(401).json({
            failed: 'Unauthorized Access'
         });
      });
   })
   .catch(error => {
      res.status(500).json({
         error: error
      });
   });
});

router.get('/info', function(req, res){
    
    if (req.headers && req.headers.authorization) {
        if (req.headers.authorization.startsWith("Bearer ")){
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
    } else {
        //Error
        return res.sendStatus(500);
    }
 });

module.exports = router;