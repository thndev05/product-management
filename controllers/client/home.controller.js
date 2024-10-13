const Product = require('../../models/product.model');
const ProductHelpers = require('../../helpers/product');

//[GET] /
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
    featured: "1",
    status: 'active'
  }

  // san pham noi bat
  const featuredProducts = await Product.find(find).limit(6);
  const newfeaturedProducts = ProductHelpers.priceNewProducts(featuredProducts);

  // san pham moi nhat
  const latestProducts = await Product.find({
    deleted: false,
    status: 'active'
  }).sort({ position: 'desc' }).limit(6);
  const newlatestProducts = ProductHelpers.priceNewProducts(latestProducts);


  res.render('client/pages/home/index', {
    pageTitle: 'Trang chủ',
    featuredProducts: newfeaturedProducts,
    latestProducts: newlatestProducts
  });
}