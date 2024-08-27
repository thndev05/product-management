const Product = require('../../models/product.model');

//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({ 
    status: 'active', 
    deleted: false
  }).sort({ position: 'desc' });

  const newProducts = products.map(item => {
    item.priceNew = (item.price - item.price * (item.discountPercentage / 100)).toFixed(0);
    return item;
  });

  res.render('client/pages/products/index', {
    pageTitle: 'Trang danh sách sản phẩm',
    products: newProducts
  });
}

//[GET] /:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const find = {
      slug: slug,
      deleted: false,
      status: 'active'
    };

    const product = await Product.findOne(find);

    res.render('client/pages/products/detail', {
      pageTitle: product.title,
      product: product
    });
    
  } catch (error) {
    console.log(error);
    res.redirect('/products')
  }
}