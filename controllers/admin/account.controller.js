const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require('../../config/system');
const md5 = require('md5');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const documents = await Account.find(find)
    .select('-password -token');

  for (let document of documents) {
    const role = await Role.findOne({
      _id: document.role_id,
      deleted: false
    });

    document.role = role.title;
  }


  res.render('admin/pages/accounts/index', {
    pageTitle: 'Danh sách tài khoản',
    documents: documents
  });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });

  res.render('admin/pages/accounts/create', {
    pageTitle: 'Tạo mới tài khoản',
    roles: roles
  });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    req.flash('error', `Email ${req.body.email} đã tồn tại`);
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else {
    req.body.password = md5(req.body.password);

    const document = new Account(req.body);
    await document.save();

    req.flash('success', 'Tạo mới tài khoản thành công');
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    _id: req.params.id,
    deleted: false
  };

  try {
    const data = await Account.findOne(find);
    const roles = await Role.find({ deleted: false });

    res.render('admin/pages/accounts/edit', {
      pageTitle: 'Chỉnh sửa tài khoản',
      roles: roles,
      data: data
    });
  } catch {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    req.flash('error', `Email ${req.body.email} đã tồn tại`);
  } else {
    if(req.body.password) {
      if (req.body.password.length < 8) {
        req.flash('error', 'Mật khẩu phải có ít nhất 8 ký tự!');
      } else {
        req.body.password = md5(req.body.password);
      }
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);

    req.flash('success', 'Cập nhật tài khoản thành công');
  }

  res.redirect('back');
}

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;

  await Account.updateOne({ _id: id }, {
    deleted: true,
    deletedAt: new Date()
  });

  req.flash('success', 'Xoá tài khoản thành công');
  res.redirect('back');
}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const account =
      await Account.findOne({ _id: id }).select('-password -token');

    const role =
      await Role.findOne({ _id: account.role_id, deleted: false });

    account.roleName = role.title;

    res.render('admin/pages/accounts/detail', {
      pageTitle: 'Chi tiết tài khoản',
      account: account
    });
  } catch {
    req.flash('error', 'Không tìm thấy tài khoản');
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}