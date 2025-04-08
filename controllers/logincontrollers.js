const jwt = require("jsonwebtoken");
const { User, FinancialYear} = require("../models"); 
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
    // Fetch the current financial year
    const financialYear = await FinancialYear.findOne({ where: { current_flag: true } });
    if (!financialYear) {
      return res.status(500).json({ success: false, message: 'No active financial year found.' });
    }


    const token = jwt.sign(
      {
        user_id: user.id,
        userrole: user.role,
        branch_id: user.branch_id || (user.Branch ? user.Branch.id : null) ,
        financial_year: financialYear.id,
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
        financial_year: financialYear.id,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
    next(err); 
  }
};