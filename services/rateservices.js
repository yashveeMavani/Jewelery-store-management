// services/rateMasterService.js
const RateMaster = require('../models/ratemaster');


exports.resetDailyRate = async (newRate) => {
    try {
        await RateMaster.destroy({ truncate: true });
        
        return await RateMaster.create({ rate: newRate });
    } catch (err) {
   return err;
    }
};
exports.createtRate = async (rate) => {
    try {
        await RateMaster.destroy({ truncate: true });
        return await RateMaster.create({ rate });
    } catch (err) {
        return err
      }
};

exports.getRate = async () => {
    try {
        const rate = await RateMaster.findOne();
        if (!rate) {
            throw new Error('No rate found');
        }
        return rate;
    } catch (err) {
         return err;
            }
};

exports.deleteRate = async () => {
    try {
        await RateMaster.destroy({ truncate: true });
    } catch (error) {
    return err;
    }
};
