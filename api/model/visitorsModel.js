const mongoose = require('mongoose');

const visitorsModel = new mongoose.Schema({
  date:{type:Date,
    default:Date.now()},
},{ timestamps: true });

module.exports = mongoose.model("VisitorsModel", visitorsModel );
