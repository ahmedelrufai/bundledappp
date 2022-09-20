const mongoose = require('mongoose');

const categoryModel = new mongoose.Schema({
  
  category:{
    type:String
  } 
},{ timestamps: true });

module.exports = mongoose.model("CategoryModel", categoryModel );
