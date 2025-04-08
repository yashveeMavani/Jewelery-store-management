const jwt = require("jsonwebtoken");
const {User} = require("../models");
const jwt_secret = "helloYashvee"; 

// Middleware to authenticate users
exports.authenticate = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, jwt_secret); 
    
    req.user = {
      ...decoded, // Spread all fields from the decoded token
      id: decoded.user_id, 
    };
    req.branch_id = decoded.branch_id; 
    req.userrole = decoded.userrole; 
    financial_year= decoded.financial_year,
    console.log("Authenticated user:", req.user); 
    next(); 

  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(400).json({ error: "Invalid token or access denied." });
  }
};


exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.userrole) {
      // console.log(req.user.userrole)
      return res.status(403).json({ error: "Access denied. User role missing." });
    }
      if (!allowedRoles.includes(req.user.userrole)) {
          return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
  
      next();
  };
};