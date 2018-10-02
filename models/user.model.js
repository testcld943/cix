const mongoose = require('mongoose');

const user = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   username: {type: String, required: true },
   firstName: {type: String, required: true },
   lastName: {type: String, required: false },
   password: {type: String, required: true },
   role: {type: String, required: true },
   licensedState: { type: Object },
   policies: { type:[] },
   age: { type: Number },
   createdAt: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('User', user);