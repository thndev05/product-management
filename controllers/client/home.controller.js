//[GET] /
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.index = async (req, res) => {
  res.render('client/pages/home/index', {
    pageTitle: 'Trang chủ',
  });
}