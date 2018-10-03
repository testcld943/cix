const mongoose = require('mongoose');

const message = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   groupId: {type: Number, required: true},
   username: {type: String, required: true},
   to: {type: String},
   subject: {type: String},
   message: {type: String, required: true},
   flagged: {type: Boolean},
   flagMessage: {type: String},
   flagType: {type: String},
   createdAt: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('Message', message);