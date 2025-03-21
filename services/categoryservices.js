const {Category}= require('../models'); 

exports.createCategory = async (categoryData) => {
try{
  return await Category.create(categoryData);
}catch(err){
    return err;
}
};

exports.getCategory = async (branch_id) => {
    try{
      return await Category.findAll({ where: { branch_id } });
    }catch(err){
        return err;
    } 
};
exports.getCategoryById = async (id) => {
  try {
    return await Category.findByPk(id); 
  } catch (err) {
    throw new Error('Error fetching category by ID: ' + err.message);
  }
};

exports.updateCategory = async (id, categoryData, branch_id) => {
  const category=await Category.findOne({ where: { id, branch_id } });
  if (!category) {
    throw new Error("Category not found or you don't have permission to update it.");
  }
  category.category_name=categoryData.category_name|| category.category_name;
  category.material=categoryData.material|| category.material;
  category.category_code=categoryData.category_code|| category.category_code;


  return await category.save();

};

exports.deleteCategory = async (id, branch_id, role) => {
  try {
    let category;

    // Super Admin can delete any category, so no branch_id check is required
    if (role === 'super_admin') {
      category = await Category.findByPk(id);
    } else {
      category = await Category.findOne({ where: { id, branch_id } });
    }

    if (!category) {
      throw new Error('Category not found or you do not have permission to delete it.');
    }

    return await category.destroy();
  } catch (err) {
    throw new Error('Error deleting category: ' + err.message);
  }
};