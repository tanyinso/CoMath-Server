const axios = require("axios");
const express = require('express');
require('dotenv').config();

const app = express();
const port = 9000;

// Create API user
const createUserOptions = {
  method: 'POST',
  url: 'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser',
  headers: {
    'Content-Type': 'application/json',
    'X-Reference-Id': '3709f568-05e2-4efc-8255-2e29f3b91d93',
    'Ocp-Apim-Subscription-Key': process.env.OCP_APIM_SUBSCRIPTION_KEY,
    'Cache-Control': 'no-cache'
  },
  data: { providerCallbackHost: 'sandbox' }
};

axios.request(createUserOptions)
  .then(function (response) {
    console.log('API user created:', response.data);
    // Perform any additional logic or API requests
  })
  .catch(function (error) {
    console.error('Failed to create API user:', error);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});