const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Endpoint for handling payment requests
app.post('/request-payment', async (req, res) => {
  try {
    const paymentRequest = {
      amount: req.body.amount,
      currency: req.body.currency,
      externalId: req.body.externalId,
      payerMessage: req.body.payerMessage,
      payeeNote: req.body.payeeNote,
      partyIdType: req.body.partyIdType,
      partyId: req.body.partyId,
    };

    const response = await axios.post(
      'https://momodeveloper.mtn.com/collection/v1_0/requesttopay',
      paymentRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Reference-Id': '123456789', // A unique reference ID for the request
          'Ocp-Apim-Subscription-Key': process.env.OCP_APIM_SUBSCRIPTION_KEY, // Your API subscription key
        },
      }
    );

    // Handle the payment request response
    console.log('Payment request successful:', response.data);
    res.status(200).json({ message: 'Payment request successful', data: response.data });
  } catch (error) {
    // Handle the error response
    console.error('Payment request failed:', error.response.data);
    res.status(500).json({ message: 'Payment request failed', error: error.response.data });
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server started on port 3000');
});