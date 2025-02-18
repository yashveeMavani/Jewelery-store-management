const categoryService = require('../services/categoryservices');

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCategory = async (req, res) => {
    try {
      const category = await categoryService.getCategory();
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  exports.updateCategory = async (req, res) => {
    try {
      const category = await categoryService.updateCategory(req.params.id,req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  exports.deleteCategory = async (req, res) => {
    try {
      const category = await categoryService.deleteCategory(req.params.id);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };