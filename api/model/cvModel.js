const mongoose = require('mongoose')

const cv = new mongoose.Schema({
userid:{
     type:String,
     
},
address:{
    type:String,
    
     },

dateofbirth:{type:String},
phoneNumber:{
  type:String
},
    gender:{type:String},

country:{  
      type:String  
    },
maritalstatus:{
    type:String,
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
facebook:{
    type:String,
    },
instagram:{
    type:String,},
linkedin:{
    type:String,
},
twitter:{
  type:String
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
objective:{
  type:String,
  
},
template:{
  type:Object
},
profile:{
  type:String
},
interest:[],
experiences:[],
educations:[],
certifications:[],
reffrences:[],
skills:[],
languages:[],

},{
    timestamps:true
})

module.exports = mongoose.model("Cv", cv)