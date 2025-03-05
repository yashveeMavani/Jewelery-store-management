const categoryService = require('../services/categoryservices');

exports.createCategory = async (req, res, next) => {
  try {
    //  throw new Error('Test error in createCategory');
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    // throw new Error('Test error in createCategory');
    const category = await categoryService.getCategory();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};