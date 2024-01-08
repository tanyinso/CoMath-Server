const axios = require("axios").default;
const { v4: uuidv4 } = require('uuid');

class Controller {
  constructor({ callbackHost, userApiKey, userId, primaryKey }) {
    this.callbackHost = callbackHost;
    this.userApiKey = userApiKey;
    this.userId = userId;
    this.primaryKey = primaryKey;
  }

  async generateUUID() {
    return new Promise((resolve, reject) => {
      try {
        const uuid = uuidv4();
        resolve(uuid);
      } catch (error) {
        reject(error);
      }
    });
  }

  async requestToPay(amount, currency, externalId, partyIdType, partyId, payerMessage, payeeNote) {
    const token = await this.getToken();
    const referenceId = await this.generateUUID();
    // const amoutpaid='10000';
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        url: "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
        headers: {
          "Content-Type": "application/json",
          "X-Reference-Id": referenceId,
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key": this.primaryKey,
          Authorization: "Bearer " + token,
        },
        data: JSON.stringify({
          amount:amount,
          currency: currency,
          externalId: externalId,
          payer: { partyIdType: partyIdType, partyId: partyId },
          payerMessage: payerMessage,
          payeeNote: payeeNote,
        }),
      };

      axios(options)
        .then(function (response) {
          const requestToPay = response.status;
          if (requestToPay == 202) {
            // Additional logic for a successful request
          }
          resolve({ responseCode: requestToPay, referenceId: referenceId });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  getToken() {
    return new Promise((resolve, reject) => {
      const authorizationBasic = Buffer.from(this.userId + ":" + this.userApiKey).toString('base64');

      const options = {
        method: "POST",
        url: "https://sandbox.momodeveloper.mtn.com/collection/token/",
        headers: {
          "Ocp-Apim-Subscription-Key": this.primaryKey,
          Authorization: "Basic " + authorizationBasic,
        },
      };

      axios(options)
        .then(function (response) {
          const token = response.data.access_token;
          if (token) {
            resolve(token);
          }
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  async getTransactionStatus(referenceId) {
    const token = await this.getToken();
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        url: `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${referenceId}`,
        headers: {
          "X-Target-Environment": "sandbox",
          "Ocp-Apim-Subscription-Key": this.primaryKey,
          Authorization: "Bearer " + token,
        },
      };

      axios(options)
        .then(function (response) {
          const transactionStatus = response.data;
          console.log(transactionStatus);
          resolve(transactionStatus);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}

module.exports = { Controller };