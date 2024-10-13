const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => {
  const getSubCategoryRecursive = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      deleted: false,
      status: 'active'
    });

    const allSub = [...subs];

    for(const sub of subs) {
      const childs = await getSubCategoryRecursive(sub.id);
      allSub.concat(childs);
    }

    return allSub;
  }

  const result = await getSubCategoryRecursive(parentId);
  return result;
}