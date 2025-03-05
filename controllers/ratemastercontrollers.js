const rateMasterService = require('../services/rateservices');


exports.createRate = async (req, res,next) => {
    try {
        const { rate } = req.body;
        const newRate = await rateMasterService.createtRate(rate);
        res.status(201).json({ success: true, data: newRate });
    } catch (error) {
        next(error);
        // res.status(400).json({ success: false, message: error.message });
    }
};

exports.getRate = async (req, res,next) => {
    try {
        // throw new Error('Test error in createCategory');
        const rate = await rateMasterService.getRate();
        res.status(200).json({ success: true, data: rate });
    } catch (error) {
        // res.status(404).json({ success: false, message: error.message });
        next(error);
    }
};

exports.deleteRate = async (req, res,next) => {
    try {
        await rateMasterService.deleteRate();
        res.status(200).json({ success: true, message: 'Rate deleted successfully' });
    } catch (error) {
        // res.status(400).json({ success: false, message: error.message });
        next(error);
    }
};
