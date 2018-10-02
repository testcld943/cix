const mongoose = require('mongoose');

const complaint = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   username: { type: String, required: true },
   insurer: { type:String, required: true },
   description: { type: String },
   flagType: { type: String },
   criticality: { type: Number },
   createdAt: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('Complaint', complaint);