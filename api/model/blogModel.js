const mongoose = require('mongoose');

const blogModel = new mongoose.Schema({
  editorId:{
    type:String,
  },
  blogArticle:[],
  blogTittle:{type:String},
  fetureImage:{type:Object},
  categories:[] 
},{ timestamps: true });

module.exports = mongoose.model("BlogModel", blogModel );
