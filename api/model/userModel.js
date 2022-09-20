const mongoose = require('mongoose');

const cvuser = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  userName: {
    required: true,
    type: String,
  },
  emailtoken:{
  required:false,
   type:String
  },
  isVerified:{
    type:Boolean,
    required:true
  },
  date:{type:Date,
  default:Date.now()},
  editor:{type:String,
    default:false},
 phone: {
    required: true,
    type: String,
  },
  
},{ timestamps: true });

module.exports = mongoose.model("CvUser", cvuser );
