const express = require("express");
const app = express();
const PORT = 3001;
app.get("/test", (req, res) => {
  res.send("Welcome to Twilio");
});

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
