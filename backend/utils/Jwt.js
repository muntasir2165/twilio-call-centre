const jwt = require("jsonwebtoken");

// this secret should not be committed to version control
// but instead should be created as an environment variable.
// But here, for the sake of simplicty, we are defining it
// as a constant
const SECRET_KEY = "SOME_SECRET_STRING";

function createJwt(username) {
  const token = jwt.sign({ username }, SECRET_KEY);
  return token;
}

function verifyToken(token) {
  const data = jwt.verify(token, SECRET_KEY);
  return data;
}

module.exports = { createJwt, verifyToken };
