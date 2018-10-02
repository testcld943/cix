const mongoose = require('mongoose');

const message = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   name: {type: String, required: true},
   description: {type: String},
   createdAt: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('Policy', message);