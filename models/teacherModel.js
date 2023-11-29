const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
     name:{
          type:String,
          required: true
     },
     email: {
          type: String,
          required: true,
          unique: true
     }, 
     password: {
          type: String,
          required: true
     },
     proffession: {
          type: String,
          required: true
     },
     profileImg: {
          type:String
     }
}, {
     collection: 'teachers'
},{
     timestamps: true
})

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;

