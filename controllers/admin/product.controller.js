const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');
const createTreeHelper = require('../../helpers/createTree');


const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system');

// [GET] /admin/products
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };


  // Filter status
  const filterStatus = filterStatusHelper(req.query);
  if(req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if(objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper({
      currentPage: 1,
      limitItems: 4,
    }, 
    req.query,
    countProducts
  );

  // Sort
  const sort = {};
  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = 'desc';
  }

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);


  res.render('admin/pages/products/index', {
    pageTitle: 'Danh sách sản phẩm',
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });  
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  
  await Product.updateOne({ _id: id }, { status: status });

  req.flash('success', 'Cập nhật trạng thái thành công!');
  res.redirect('back');
} 

// [PATCH] /admin/products/change-multi/
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(', ');

  switch (type) {
    case 'active':
      await Product.updateMany(
        { _id: { $in: ids } }, 
        { status: 'active' }
      );
      req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break;

    case 'inactive':
      await Product.updateMany(
        { _id: { $in: ids } }, 
        { status: 'inactive' }
      );

      req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break;

    case 'delete-all':
      await Product.updateMany(
        { _id: { $in: ids } },
        { 
          deleted: true,
          deletedAt: new Date()
        }
      );

      req.flash('success', `Xoá thành công ${ids.length} sản phẩm!`);
      break;

    case 'change-position':
      // console.log(ids);
      for (const item of ids) {
        let [id, position] = item.split('-');
        position = parseInt(position);

        await Product.updateOne({ _id: id }, { position: position });
      }

      req.flash('success', `Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
      break;

    default:
      break;
  }
  
  res.redirect('back');
} 

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  
  // Xoá cứng
  // await Product.deleteOne({ _id: id });

  // Xoá mềm
  await Product.updateOne({ _id: id }, 
    { 
      deleted: true,
      deletedAt: new Date()
    }
  );
  
  req.flash('success', `Xoá thành công sản phẩm!`);
  res.redirect('back');
} 

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const find = { 
    deleted: false 
  };

  const category = await ProductCategory.find(find);
  const treeCategory = createTreeHelper.tree(category);

  res.render('admin/pages/products/create', {
    pageTitle: 'Thêm mới sản phẩm',
    category: treeCategory
  }); 
} 

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => { 
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == '') {
    const countDocuments = await Product.countDocuments({});
    req.body.position = countDocuments + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  
  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
} 

// [GET] /admin/products/edit
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false
    }

    const product = await Product.findById(find);

    const category = await ProductCategory.find({ deleted: false });
    const treeCategory = createTreeHelper.tree(category);
  
    res.render('admin/pages/products/edit', {
      pageTitle: 'Chỉnh sửa sản phẩm',
      product: product,
      category: treeCategory
    }); 
  } catch (error) {
    req.flash('error', 'Không tồn tại sản phẩm này!');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
} 

// [PATCH] /admin/products/edit
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }

  try {
    await Product.updateOne({ _id: id }, req.body);
    req.flash('success', 'Cập nhật thành công sản phẩm!');
  } catch (error) {
    req.flash('error', 'Cập nhật thất bại!');
  }

  res.redirect('back');
} 

// [GET] /admin/products/detail
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const find = {
      deleted: false,
      _id: id
    }

    const product = await Product.findOne(find);
    
    res.render('admin/pages/products/detail', {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
} 
