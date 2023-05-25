const jwt = require("jsonwebtoken");
const { Unauthorized } = require("../Error");

const auth = async (req, res,next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Unauthorized("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload._id, email: payload.email };
    next();
  } catch (error) {
    throw new Unauthorized("Authentication Invalid");
  }
};

module.exports = auth;
