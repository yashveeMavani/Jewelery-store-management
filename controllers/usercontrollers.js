const userService = require('../services/userservices');

exports.createUser = async (req, res,next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
    // res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res,next) => {
  try {
    const users = await userService.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
    // res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateUser = async (req, res,next) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    next(error);
    // res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res,next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
    // res.status(400).json({ success: false, message: error.message });
  }
};
