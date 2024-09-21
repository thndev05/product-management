const Account = require("../../models/account.model");
const systemConfig = require('../../config/system');

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    req.flash('error', 'Bạn phải đăng nhập để truy cập!');
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({ token: token });

    if(!user) {
      req.flash('error', 'Bạn phải đăng nhập để truy cập!');
      return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      req.flash('success', 'Đăng nhập thành công!');
      next();
    }
  }
}