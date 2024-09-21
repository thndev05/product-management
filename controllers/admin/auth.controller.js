const Account = require("../../models/account.model");
const md5 = require('md5');
const systemConfig = require("../../config/system");


//[GET] /admin/auth/login
module.exports.login = async (req, res) => {
  if(req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render('admin/pages/auth/login', {
      pageTitle: 'Đăng nhập hệ thống'
    });
  }
}

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash('error', 'Email khong ton tai');
    return res.redirect('back');
  }

  console.log(md5(password));
  console.log(user.password);

  if(md5(password) !== user.password) {
    req.flash('error', 'Sai mat khau');
    return res.redirect('back');
  }

  if(user.status !== 'active') {
    req.flash('error', 'Tai khoan da bi khoa');
    return res.redirect('back');
  }

  res.cookie('token', user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

//[GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('token');

  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}