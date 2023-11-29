const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://tanyinsobright237:Baxt24@cluster0.qrmljfv.mongodb.net/comath'; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

  module.exports = mongoose.connection;