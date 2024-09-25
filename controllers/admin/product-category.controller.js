const ProductCategory = require('../../models/product-category.model');
const systemConfig = require('../../config/system');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const createTreeHelper = require('../../helpers/createTree');
const Account = require("../../models/account.model");


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

  for (const category of documents) {
    // Created user
    const createdUser = await Account.findOne({ _id: category.createdBy.account_id })

    if(createdUser) {
      category.accountFullName = createdUser.fullName;
    }

    // Updated user
    const updatedBy = category.updatedBy.slice(-1)[0];
    if(updatedBy) {
      const userUpdated = await Account.findOne({ _id: updatedBy.account_id });

      updatedBy.accountFullName = userUpdated.fullName;
    }
  }

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

  req.body.createdBy = {
    account_id: res.locals.user.id,
  }
  
  const document = new ProductCategory(req.body);
  await document.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`); 
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({ 
      _id: id,
      deleted: false
    });

    const documents = await ProductCategory.find({
      deleted: false
    });

    const newDocuments = createTreeHelper.tree(documents);

    res.render('admin/pages/products-category/edit', {
      pageTitle: 'Chỉnh sửa danh mục',
      data: data,
      documents: newDocuments
    });
  } catch (err) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.position = parseInt(req.body.position);

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await ProductCategory.updateOne({ _id: id }, {
    ...req.body,
    $push: { updatedBy: updatedBy }
  });
  
  res.redirect('back');
}

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, 
    { 
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
    }
  );
  
  req.flash('success', 'Xoá thành công danh mục sản phẩm!')
  res.redirect('back');
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });

    if(data.parent_id) {
      const parent = await ProductCategory.findById(data.parent_id);
      data.parentTitle = parent.title;
    }

    res.render('admin/pages/products-category/detail', {
      pageTitle: 'Chi tiết danh mục',
      category: data
    });
  } catch (error) {
    req.flash('error', 'Không có danh mục này');
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}