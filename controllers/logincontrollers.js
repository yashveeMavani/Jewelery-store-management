const jwt = require("jsonwebtoken");
const { User} = require("../models"); 
const jwt_secret = "helloYashvee"; 

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    const token = jwt.sign(
      {
        user_id: user.id,
        userrole: user.role,
        branch_id: user.branch_id || (user.Branch ? user.Branch.id : null) 
      },
      jwt_secret, 
      { expiresIn: "1d" } 
    );

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        branch_id: user.branch_id,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
    next(err); 
  }
};