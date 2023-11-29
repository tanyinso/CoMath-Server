const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
     name:{
          type:String,
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
     profileImg: {
          type:String
     }
}, {
     collection: 'users'
})

const User = mongoose.model('User', UserSchema);

module.exports = User;

