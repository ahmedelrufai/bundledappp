const mongoose = require('mongoose')

const letter = new mongoose.Schema({
userid:{
     type:String,
     
},
address:{
    type:String,
    
     },

compenyname:{type:String},
phoneNumber:{
  type:String
},
city:{type:String},

receipient:{  
      type:String  
    },

state:{
    type:String,
    },
email:{
  type:String,
  },
images:{
    type:Object,
    },

fullName:{
  type:String,
  
},
date:{ 
  type:Date,
  default:Date.now()
},

profession:{
  type:String,
  
}, 

template:{
  type:Object
},
theletter:{
  type:String
},
streetaddress:{
  type:String
}


},{
    timestamps:true
})

module.exports = mongoose.model("Letter", letter)