const twilio = require("twilio");

class Twilio {
  phoneNumber = "+1 442 222 2560";
  phoneNumberSid = "PNaeb2e7be3dafdb065c7d2111b02f8597";
  tokenSid = "SK14121834fa1680f573dbc6c47f336d12";
  tokenSecret = "J9yw8s11IKY3RbUOYUnGZBOtXdcofrOh";
  accountSid = "AC8ef30fe9afa308d455faf762fc1aebaf";
  verify = "VAfb95dfd46111bbc2475f51210031e625";
  client;
  constructor() {
    this.client = twilio(this.tokenSid, this.tokenSecret, {
      accountSid: this.accountSid,
    });
  }

  getTwilio() {
    this.client;
  }
}

const instance = new Twilio();
Object.freeze(instance);

module.exports = instance;
