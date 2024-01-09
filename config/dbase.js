 const dotenv=require('dotenv');
 const mongoose = require('mongoose');
 const mongoURI =process.env.MONGODB_URI ; 
 mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
     console.log('Connected to MongoDB');
   })
   .catch((err) => {
     console.error('Failed to connect to MongoDB:', err);
   });

   module.exports = mongoose.connection;
