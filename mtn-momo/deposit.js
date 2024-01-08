const axios = require('axios');

const appKey = 'APP_KEY';
const appPIN = 'USER_PIN';
const apiKey = 'API_KEY';
const url = `https://mesomb.hachther.com/en/api/v1.0/applications/${appKey}/deposit/`;
const data = {
  amount: 20,
  receiver: '237690000000',
  service: 'ORANGE',
  pin: appPIN
};

axios.post(url, data, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla',
    'Authorization': `Token ${apiKey}`
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Axios Error:', error);
  });