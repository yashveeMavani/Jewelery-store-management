const categoryService = require('../services/categoryservices');

exports.createCategory = async (req, res, next) => {
  try {
    //  throw new Error('Test error in createCategory');
    const { role, branch_id } = req.user;
    if (role !== 'super_admin' && req.body.branch_id && req.body.branch_id !== branch_id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to create categories for this branch.' });
    }
        const categoryData = { ...req.body, branch_id : req.branch_id }; // Attach branch_id to the category data
    const category = await categoryService.createCategory(categoryData);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error); 
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const { role, branch_id } = req.user;
    const categories = role === 'super_admin'
      ? await categoryService.getAllCategories()
      : await categoryService.getCategory(branch_id);

    res.status(201).json({ success: true, data: categories  });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { role, branch_id } = req.user;
    if (role !== 'super_admin') {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category || category.branch_id !== branch_id) {
        return res.status(403).json({ success: false, message: 'You are not authorized to update this category.' });
      }
    }
    const category = await categoryService.updateCategory(req.params.id, req.body, branch_id);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error); 
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { role, branch_id } = req.user; 
    await categoryService.deleteCategory(req.params.id, branch_id, role);

    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error); 
  }
};