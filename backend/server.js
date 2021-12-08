const express = require("express");
const twilio = require("./Twilio");

const app = express();

const PORT = 3001;
app.get("/test", (req, res) => {
  res.send("Welcome to Twilio");
});

app.get("/login", async (req, res) => {
  console.log("logging in");
  // const data = await twilio.sendVerifyAsync(process.env.MOBILE, "sms");
  const data = await twilio.sendVerifyAsync("+14084665269", "sms");
  res.send(data);
});

app.get("/verify", async (req, res) => {
  console.log("Verifying code");
  // const data = await twilio.verifyCodeAsync(process.env.MOBILE, req.query.code);
  const data = await twilio.verifyCodeAsync("+14084665269", req.query.code);
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
