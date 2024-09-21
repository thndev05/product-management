const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require('../../config/system');

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    req.flash('error', 'Bạn phải đăng nhập để truy cập!');
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user =
      await Account.findOne({ token: token }).select('-password');

    if(!user) {
      req.flash('error', 'Bạn phải đăng nhập để truy cập!');
      return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      const role =
        await Role.findOne({ _id: user.role_id })
                  .select('title permissions');

      res.locals.user = user;
      res.locals.role = role;

      next();
    }
  }
}