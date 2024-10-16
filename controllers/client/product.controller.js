const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');

const ProductHelpers = require('../../helpers/product');
const ProductCategoryHelpers = require('../../helpers/product-category');


//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({ 
    status: 'active', 
    deleted: false
  }).sort({ position: 'desc' });

  const newProducts = ProductHelpers.priceNewProducts(products);

  res.render('client/pages/products/index', {
    pageTitle: 'Trang danh sách sản phẩm',
    products: newProducts
  });
}

//[GET] /detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slugProduct;

    const find = {
      slug: slug,
      deleted: false,
      status: 'active'
    };

    const product = await Product.findOne(find);
    if(product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: 'active',
        deleted: false
      });

      product.category = category;
    }

    product.priceNew = ProductHelpers.priceNewProduct(product);

    res.render('client/pages/products/detail', {
      pageTitle: product.title,
      product: product
    });
    
  } catch (error) {
    console.log(error);
    res.redirect('/products')
  }
}

//[GET] /:slugCategory
module.exports.category = async (req, res) => {
  try {
    const slug = req.params.slugCategory;
    const category = await ProductCategory.findOne({ slug: slug });

    const subCategory = await ProductCategoryHelpers.getSubCategory(category.id);
    const subCategoryIds = subCategory.map((item) => item.id);

    const products = await Product.find({
      deleted: false,
      status: 'active',
      product_category_id: { $in: [category.id, ...subCategoryIds] }
    }).sort({ position: 'desc' });

    const newProducts = ProductHelpers.priceNewProducts(products);

    res.render('client/pages/products/index', {
      pageTitle: category.title,
      products: newProducts
    });
  } catch {
    res.redirect('/');
  }
}