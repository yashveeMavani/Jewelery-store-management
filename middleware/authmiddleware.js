const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwt_secrect = "helloYashvee";
exports.authenticate = async (req, res, next) => {
  if (!req.header("Authorization"))
    return res.status(401).json({ error: "Access denied. No token provided." });
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, jwt_secrect);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token or not access" });
  }
};

exports.authorize = (role) => {
  return (req, res, next) => {
    console.log(req.user);
    if (req.user.userrole !== role) {
      return res
        .status(403)
        .json({ success: false, message: "only access by super admin" });
    }
    next();
  };
};