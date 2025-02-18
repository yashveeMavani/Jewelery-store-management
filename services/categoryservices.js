const {Category}= require('../models/category');

exports.createCategory = async (categoryData) => {
try{
  return await Category.create(categoryData);
}catch(err){
    return err;
}
};

exports.getCategory = async () => {
    try{
      return await Category.findAll();
    }catch(err){
        return err;
    }
};
exports.updateCategory = async (id, categoryData) => {
  const category=await Category.findByPk(id);

  category.category_name=categoryData.category_name|| category.category_name;
  category.material=categoryData.material|| category.material;
  category.category_code=categoryData.category_code|| category.category_code;


  return await category.save();

};

exports.deleteCategory = async (id) => {
    const category=await Category.findByPk(id);
  
    return await category.destroy();
  
  };