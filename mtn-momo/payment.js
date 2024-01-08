const axios = require('axios');

const url = 'https://mesomb.hachther.com/api/v1.0/payment/online/';
const appKey = 'APP_KEY';
const data = {
  amount: 100,
  payer: '676366327',
  fees: true,
  service: 'MTN',
  currency: 'XAF',
  message: 'Message',
  country: 'CM'
};

axios({
  method: 'post',
  url: url,
  data: data,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla',
    'X-MeSomb-Application': appKey
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log('Axios Error:', error);
  });