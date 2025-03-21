const userService = require('../services/userservices');
const { User } = require('../models');
exports.createUser = async (req, res, next) => {
  try {
    const { role, branch_id } = req.user; 
    if (role === 'admin' && req.body.branch_id !== req.user.branch_id) {
      return res.status(403).json({ 
          success: false, 
          message: 'You are not authorized to create users for this branch.' 
      });
  }

    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { role, branch_id } = req.user;

    let filters = {};
    if (role !== 'super_admin') {
      filters.branch_id = branch_id;
    }

    const users = await userService.getUsers(filters);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { role, branch_id } = req.user; 

  
    const user=await User.findByPk(req.params.id);
    if(!user || user.branch_id !== branch_id){
      return res.status(403).json({ success: false, message: 'You are not authorized to update this user' });
    }
    await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, message: 'User updated successfully' });
  // } 
}catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { role, branch_id } = req.user; 
    
    // Only Super Admin can delete users for any branch
    if (role !== 'super_admin') {
      const userToDelete = await User.findByPk(req.params.id );
      if (!userToDelete || userToDelete.branch_id !== branch_id) {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this user.',userToDelete ,branch_id });
      }
    }

    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};