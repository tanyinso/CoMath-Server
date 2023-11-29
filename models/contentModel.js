const mongoose = require('mongoose')
const contentSchema = mongoose.Schema({
     teacher: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Teacher'
     },
     title :{
          type: String,
          required: true
     },
     video: {
          type: String,
          required: true
     },
     description: {
          type: String
     },
     thumbnail: {
          type: String,
          required: true
     }


}, {
     timestamps: true,
})

const Content = mongoose.model('Content', contentSchema);
module.exports = Content