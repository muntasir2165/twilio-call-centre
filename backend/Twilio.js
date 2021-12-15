const twilio = require("twilio");
const { Policy } = require("twilio/lib/jwt/taskrouter/TaskRouterCapability");
const VoiceResponse = require("twilio/lib/twiml/VoiceResponse");

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

  async sendVerifyAsync(to, channel) {
    const data = await this.client.verify
      .services(this.verify)
      .verifications.create({
        to,
        channel,
      });
    console.log("sendVerify");
    return data;
  }

  async verifyCodeAsync(to, code) {
    const data = await this.client.verify
      .services(this.verify)
      .verificationChecks.create({ to, code });
    console.log("verifyCode");
    return data;
  }

  voiceResponse(message) {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: "female",
      },
      message
    );

    twiml.redirect("https://callcenter.loca.lt/enqueue");

    return twiml;
  }

  enqueueCall(queueName) {
    const twim = new VoiceResponse();
    twim.enqueue(queueName);

    return twim;
  }
}

const instance = new Twilio();
Object.freeze(instance);

module.exports = instance;
