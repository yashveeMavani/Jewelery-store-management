const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
// const bcrypt = require("bcrypt");

exports.login = async (req, res,next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });
    console.log(user);
    if (user && password == user.password) {
      const token = jwt.sign({ userrole: user.role }, "helloYashvee", {
        expiresIn: "1h",
      });
      return res.json({ token });
    }
    res.status(401).json({ err: "Invalid username or password" });
  } catch (err) {
    console.log(err);
    next(err);
    res.status(401).json({ err: err });
  }
};