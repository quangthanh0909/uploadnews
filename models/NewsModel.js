const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const newsSchema = Schema({
  title: {
    type: String,
    required : true
  },
  content:{
    type:String,
    required: true
  },
  photo: String,
  date:{
    type: Date,
    default: Date.now()
  }
  
})
module.exports = mongoose.model('NewsModel',newsSchema);
