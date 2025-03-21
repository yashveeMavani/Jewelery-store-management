const { User } = require('../models'); 
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const pool = new Pool

exports.createUser = async (userData) => {
  if (userData.role !== 'super_admin') {
    const existingSuperAdmin = await User.findOne({role:userData.role});
    console.log(existingSuperAdmin);
    if (existingSuperAdmin) {
      throw new Error('A Super Admin already exists.');
    }
  }
  return await User.create(userData);

};

exports.updateUser = async (id, userData) => {
  const user=await User.findByPk(id);
  console.log(user);
  user.username=userData.username|| user.username;
  return await user.save();

};

exports.deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

exports.getUsers = async (filters = {}) => {
  return await User.findAll();
};