const { RateMaster } = require('../models');

exports.resetDailyRate = async (newRate, branch_id) => {
    try {
        await RateMaster.destroy({ where: { branch_id } });
        return await RateMaster.create({ rate: newRate, branch_id });
    } catch (err) {
        return err;
    }
};

exports.createRate = async (rate, branch_id) => {
    try {
        await RateMaster.destroy({ where: { branch_id } });  
        return await RateMaster.create({ rate, branch_id });
    } catch (err) {
        return err;
    }
};

exports.getRate = async (branch_id) => {
    try {
        const rate = await RateMaster.findOne({ where: { branch_id } });
        if (!rate) {
            throw new Error('No rate found for this branch');
        }
        return rate;
    } catch (err) {
        return err;
    }
};

exports.deleteRate = async (branch_id) => {
    try {
        await RateMaster.destroy({ where: { branch_id } });
    } catch (error) {
        return error;
    }
};
