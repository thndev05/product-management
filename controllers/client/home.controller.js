const Product = require('../../models/product.model');
const ProductHelpers = require('../../helpers/product');

//[GET] /
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
    featured: "1",
    status: 'active'
  }

  const featuredProducts = await Product.find(find).limit(6);
  const newProducts = ProductHelpers.priceNewProducts(featuredProducts);

  res.render('client/pages/home/index', {
    pageTitle: 'Trang chủ',
    featuredProducts: newProducts
  });
}