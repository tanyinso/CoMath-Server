const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const axios = require('axios');
const app = express();
const port = 7777;
const db = require('./config/dbase');
const dotenv = require('dotenv');

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// const whiteList = ['http://localhost:3000','https://frontend-gules-tau.vercel.app'];
// app.use(cors({
//   origin: whiteList,
//   optionsSuccessStatus: 200,
//   credentials: true,
// }));

app.use('/public', express.static('public'));
app.use(errorHandler);
app.use('/user', require('./routes/user.routes'));
app.use('/teacher', require('./routes/teachers.routes'));
app.use('/content', require('./routes/content.routes'));

app.post('/payment', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const url = 'https://mesomb.hachther.com/api/v1.0/payment/online/';
  const appKey = process.env.APIKEY;
  const data = {
    amount: 11,
    payer: phoneNumber,
    fees: true,
    service: 'MTN',
    currency: 'XAF',
    message: 'Message',
    country: 'CM'
  };

  axios
    .post(url, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla',
        'X-MeSomb-Application': appKey
      }
    })
    .then(response => {
      const { status, message } = response.data;

      if (status === '200') {
        res.json({ success: true, message });
        console.log("transaction successful")
      } else {
        // Transaction failed
        res.json({ success: false, message });
        console.log("transaction failed");
      }
    })
    .catch(error => {
      console.error('Axios Error:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    });
});

app.post('/deposit', (req, res) => {
  const url = 'https://mesomb.hachther.com/api/v1.0/payment/online/';
  const appKey = process.env.APIKEY;
  const data = {
    amount: 11,
    receiver: '237690000000',
    service: 'ORANGE',
    pin: 'USER_PIN'
  };

  axios
    .post(url, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla',
        'X-MeSomb-Application': appKey
      }
    })
    .then(response => {
      const { status, message } = response.data;

      if (status === 'success') {
        // Transaction was successful
        res.json({ success: true, message });
      } else {
        // Transaction failed
        res.json({ success: false, message });
      }
    })
    .catch(error => {
      console.error('Axios Error:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    });
});

app.listen(port, () => {
  console.log('Connected to port ' + port);
});