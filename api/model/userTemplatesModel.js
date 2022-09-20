
const mongoose = require('mongoose');

const userTemplatesModel = new mongoose.Schema({
  userid:{
    type:String,
  },
  template:{
    type:String
  } 
},{ timestamps: true });

module.exports = mongoose.model("UserTemplatesModel", userTemplatesModel );
