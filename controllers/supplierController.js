const { Supplier } = require('../models');

exports.createSupplier = async (req, res, next) => {
  try {
    const { name, gst, contact, address, ledger } = req.body;
    const branch_id = req.user.branch_id;

    if (!name || !branch_id) {
      return res.status(400).json({ success: false, message: 'Name and branch_id are required.' });
    }

    const newSupplier = await Supplier.create({ name, gst, contact, address, ledger, branch_id });
    res.status(201).json({ success: true, data: newSupplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    next(error);
  }
};

exports.listSuppliers = async (req, res, next) => {
  try {
    const branch_id = req.user.branch_id; 
    const suppliers = await Supplier.findAll({ where: { branch_id } });
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    console.error('Error listing suppliers:', error);
    next(error);
  }
};

exports.updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, gst, contact, address, ledger } = req.body;
    const branch_id = req.user.branch_id; 

    const supplier = await Supplier.findOne({ where: { id, branch_id } });
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found.' });
    }

    await supplier.update({ name, gst, contact, address, ledger });
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    console.error('Error updating supplier:', error);
    next(error);
  }
};

exports.deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branch_id = req.user.branch_id; 

    const supplier = await Supplier.findOne({ where: { id, branch_id } });
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found.' });
    }

    await supplier.destroy();
    res.status(200).json({ success: true, message: 'Supplier deleted successfully.' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    next(error);
  }
};