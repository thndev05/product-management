const ProductCategory = require('../../models/product-category.model');
const systemConfig = require('../../config/system');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const createTreeHelper = require('../../helpers/createTree');


// [GET] /admin/products-category/
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const filterStatus = filterStatusHelper(req.query);
  if(req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if(objectSearch.regex) {
    find.title = objectSearch.regex;
  }


  const documents = await ProductCategory.find(find);

  const newDocuments = createTreeHelper.tree(documents);


  res.render('admin/pages/products-category/index', {
    pageTitle: 'Danh mục sản phẩm',
    documents: newDocuments,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword
  }); 
} 

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false
  };

  const documents = await ProductCategory.find(find);
  
  const newDocuments = createTreeHelper.tree(documents);

  res.render('admin/pages/products-category/create', {
    pageTitle: 'Tạo mới danh mục',
    documents: newDocuments
  }); 
} 

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if(req.body.position == '') {
    const countDocuments = await ProductCategory.countDocuments({});
    req.body.position = countDocuments + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  
  const document = new ProductCategory(req.body);
  await document.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`); 
}