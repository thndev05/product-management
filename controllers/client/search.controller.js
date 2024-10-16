const Product = require('../../models/product.model');
const ProductHelpers = require('../../helpers/product');

// [GET]: /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];

  if(keyword) {
    const regex = new RegExp(keyword, 'gi');

    const find = {
      deleted: false,
      status: 'active',
      title: regex
    }

    const products = await Product.find(find);

    newProducts = ProductHelpers.priceNewProducts(products);
  }

  res.render('client/pages/search/index', {
    pageTitle: 'Kết quả tìm kiếm',
    keyword: keyword,
    products: newProducts
  });
}