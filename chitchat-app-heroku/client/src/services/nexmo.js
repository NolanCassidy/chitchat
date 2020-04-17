//The Nexmo Api
const Nexmo = require('nexmo');

const client = new Nexmo({
  apiKey: '',
  apiSecret: '',
});

export const sms = client.message;
export const from = '';
