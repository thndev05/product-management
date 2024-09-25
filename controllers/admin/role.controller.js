const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const systemConfig = require('../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const documents = await Role.find(find);

  for (const role of documents) {
    // Created user
    const createdUser = await Account.findOne({ _id: res.locals.user.id })
    if(createdUser) {
      role.accountFullName = createdUser.fullName;
    }

    // Updated user
    const updatedBy = role.updatedBy.slice(-1)[0];
    if(updatedBy) {
      const updatedUser = await Account.findOne({ _id: updatedBy.account_id });
      updatedBy.accountFullName = updatedUser.fullName;
    }
  }

  res.render('admin/pages/roles/index', {
    pageTitle: 'Nhóm quyền',
    documents: documents
  });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render('admin/pages/roles/create', {
    pageTitle: 'Thêm mới nhóm quyền'
  });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const document = new Role(req.body);

  req.body.createBy = {
    account_id: res.locals.user.id
  }

  await document.save();
  
  res.redirect(`${systemConfig.prefixAdmin}/roles`); 
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false
    };
  
    const data = await Role.findOne(find)
  
    res.render('admin/pages/roles/edit', {
      pageTitle: 'Chỉnh sửa nhóm quyền',
      data: data
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`); 
  }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    await Role.updateOne({ _id: id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    });
    
    req.flash('success', 'Cập nhật nhóm quyền thành công');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Cập nhật nhóm quyền thất bại');
  }

  res.redirect('back');
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
 let find = { 
  deleted: false,
 }

 const documents = await Role.find(find);

 res.render('admin/pages/roles/permissions', {
  pageTitle: 'Phân quyền',
  documents: documents
 });
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  
  for (const item of permissions) {
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
  }
  
  req.flash('success', 'Cập nhật phân quyền thành công');
  res.redirect('back');
}


// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;

  await Role.updateOne({ _id: id }, {
    deleted: true,
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
  });

  req.flash('success', 'Xoá nhóm quyền thành công');
  res.redirect('back');
}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Role.findById(id);

    res.render('admin/pages/roles/detail', {
      pageTitle: 'Chi tiết nhóm quyền',
      role: data
    });
  } catch {
    req.flash('error', 'Không tồn tại nhóm quyền này');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}