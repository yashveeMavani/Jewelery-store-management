const { Branch } = require('../models');

const createBranch = async (req, res) => {
    const { name, location } = req.body;
    const branch = await Branch.create({ name, location });
    res.json({ message: 'Branch Created', branch });
};

const getBranches = async (req, res) => {
    const branches = await Branch.findAll();
    res.json(branches);
};

const updateBranch = async (req, res) => {
    const { id } = req.params;
    const { name, location, status } = req.body;
    await Branch.update({ name, location, status }, { where: { id } });
    res.json({ message: 'Branch Updated' });
};

const deleteBranch = async (req, res) => {
    const { id } = req.params;
    await Branch.destroy({ where: { id } });
    res.json({ message: 'Branch Deleted' });
};

module.exports = { createBranch, getBranches, updateBranch, deleteBranch };
